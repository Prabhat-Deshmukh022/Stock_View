import db from "../../../../../db/db";

export async function GET() {
    try {
        const totalValue = await db.query(`SELECT SUM(value) as total_value FROM holdings`)
        const totalGainLoss = await db.query(`SELECT SUM(return_value) as total_gain_loss FROM holdings`)
        const totalGainLossPercent = await db.query(`SELECT SUM(return_percent) as total_gain_loss_percent FROM holdings`)
        const totalInvested = await db.query(`SELECT SUM(quantity*avg_price) as total_invested FROM holdings`)
    
        const get_best_performer = await db.query(`SELECT symbol, company_name as name, return_percent as gainPercent FROM holdings ORDER BY return_percent DESC LIMIT 1 `)
        const get_worst_performer = await db.query(`SELECT symbol, company_name as name, return_percent as gainPercent FROM holdings ORDER BY return_percent ASC LIMIT 1 `)
        
        const construct = (symbol:string, name:string, gainPercent:number) => {
            return { "symbol":symbol, "name":name, "gainPercent":gainPercent }
        }
    
        const best = get_best_performer.rows[0]
        const worst = get_worst_performer.rows[0]
        console.log(best);
    
        const diverse_res = await db.query(`
        SELECT 
            COUNT(DISTINCT sector) AS sectors,
            COUNT(DISTINCT market_cap) AS market_caps 
        FROM holdings
        `);
    
        const sectors = parseInt(diverse_res.rows[0].sectors);
        const marketCaps = parseInt(diverse_res.rows[0].market_caps);
    
        const rawScore = (sectors + marketCaps) * 1.5;
        const diversificationScore = Math.min(10, rawScore);
    
        let riskLevel = "Moderate";
    
        if (diversificationScore <= 4) {
        riskLevel = "High";
        } else if (diversificationScore > 7) {
        riskLevel = "Low";
        }

        const total_holdings = await db.query(`SELECT COUNT(DISTINCT symbol) as total_holdings FROM holdings`)
    
        const result = {
            "totalValue":totalValue.rows[0].total_value,
            "totalInvested":totalInvested.rows[0].total_invested,
            "totalGainLoss":totalGainLoss.rows[0].total_gain_loss,
            "totalGainLossPercent":totalGainLossPercent.rows[0].total_gain_loss_percent,
            "topPerformer":construct(best.symbol, best.name, parseFloat(best.gainpercent) ),
            "worstPerformer": construct(worst.symbol, worst.name, parseFloat(worst.gainpercent)),
            "diversificationScore":diversificationScore,
            "riskLevel":riskLevel,
            "totalHoldings":total_holdings.rows[0].total_holdings
        }
    
        return Response.json(result)
    } catch (error) {
        console.log(`Error in fetching summary ${error}`);
        return new Response(JSON.stringify(`Error in fetching summary ${error}`), {"status":500})
    }
}