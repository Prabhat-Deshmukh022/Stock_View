import db from "../../../../../db/db";

export async function GET() {
    try {
        const bySector = await db.query("SELECT sector, SUM(value) as value, ROUND(SUM(value)*100/(SUM(SUM(value)) OVER())) as percentage FROM holdings GROUP BY sector")
        const byMarketCap = await db.query("SELECT market_cap, SUM(value) as value, ROUND(SUM(value)*100/SUM(SUM(value)) OVER()) as percentage FROM holdings GROUP BY market_cap")

        console.log(bySector);
        console.log(byMarketCap)

        let result = {
            "bySector":bySector.rows,
            "byMarketCap":byMarketCap.rows
        }
        
    
        return Response.json(result)
    } catch (error) {
        console.log(`Error in fetching allocation info ${error}`);
        return new Response(JSON.stringify(`Error in fetching allocation info ${error}`), {"status":500})
    }
}