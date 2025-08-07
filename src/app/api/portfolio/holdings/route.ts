import db from "../../../../../db/db";

export async function GET() {
   try {
    const result = await db.query(
     "SELECT symbol, company_name, quantity::numeric, avg_price::numeric, current_price::numeric, sector, market_cap, value::numeric, return_value::numeric AS gainLoss, return_percent::numeric AS gainLossPercent from holdings"
    )
 
    return Response.json(result.rows)
   } catch (error) {
    console.log(`Error in fetching holdings information ${error}`);
    return new Response(JSON.stringify(`Error in fetching holdings information ${error}`), {"status":500})
    
   }
}