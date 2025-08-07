import db from "../../../../../db/db";

export async function GET() {
   try {
    const result = await db.query(
     "SELECT symbol, company_name, quantity, avg_price, current_price, sector, market_cap, value, return_value AS gainLoss, return_percentage AS gainLossPercent from holdings"
    )
 
    return Response.json(result.rows)
   } catch (error) {
    console.log(`Error in fetching holdings information ${error}`);
    return new Response(JSON.stringify(`Error in fetching holdings information ${error}`), {"status":500})
    
   }
}