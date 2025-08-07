import db from "../../../../../db/db";
import { parse, subMonths, format } from 'date-fns';

export async function GET() {
    try {
        const performance = await db.query("SELECT date, value as portfolio, nifty_fifty, gold from historical_performance")
    
        const query_max_date = await db.query("SELECT MAX(date) as max_date FROM historical_performance");
        const max_date_str: string = query_max_date.rows[0].max_date;

        const max_date = parse(max_date_str, 'dd-MM-yyyy', new Date());

        // Format derived dates
        const cur_date = format(max_date, 'dd-MM-yyyy');
        const one_month = format(subMonths(max_date, 1), 'dd-MM-yyyy');
        const three_month = format(subMonths(max_date, 3), 'dd-MM-yyyy');
        const one_year = format(subMonths(max_date, 11), 'dd-MM-yyyy');    

        const gains_portfolio = await db.query("SELECT MAX(CASE WHEN date=$1 THEN value END) as current, MAX(CASE WHEN date=$2 THEN value END) as one_month_ago, MAX(CASE WHEN date=$3 THEN value END) as three_months_ago, MAX(CASE WHEN date=$4 THEN value END) as one_year_ago FROM historical_performance", [cur_date, one_month, three_month, one_year])
        const gains_nifty_fifty = await db.query("SELECT MAX(CASE WHEN date=$1 THEN nifty_fifty END) as current, MAX(CASE WHEN date=$2 THEN nifty_fifty END) as one_month_ago, MAX(CASE WHEN date=$3 THEN nifty_fifty END) as three_months_ago, MAX(CASE WHEN date=$4 THEN nifty_fifty END) as one_year_ago FROM historical_performance", [cur_date, one_month, three_month, one_year])
        const gains_gold = await db.query("SELECT MAX(CASE WHEN date=$1 THEN gold END) as current, MAX(CASE WHEN date=$2 THEN gold END) as one_month_ago, MAX(CASE WHEN date=$3 THEN gold END) as three_months_ago, MAX(CASE WHEN date=$4 THEN gold END) as one_year_ago FROM historical_performance", [cur_date, one_month, three_month, one_year])
        
        const calc_res = (current:number, past:number) => {
            return ( (current-past)/past * 100 )
        }

        let p = gains_portfolio.rows[0]
        let n = gains_nifty_fifty.rows[0]
        let g = gains_gold.rows[0]

        let result = {
            timeline: performance.rows,
            returns: {
                "portfolio":{
                    "one_month":calc_res(p.current, p.one_month_ago).toFixed(2),
                    "three_months":calc_res(p.current, p.three_months_ago).toFixed(2),
                    "one_year":calc_res(p.current,p.one_year_ago).toFixed(2)
                },
                "nifty_fifty":{
                    "one_month":calc_res(n.current, n.one_month_ago).toFixed(2),
                    "three_months":calc_res(n.current, n.three_months_ago).toFixed(2),
                    "one_year":calc_res(n.current,n.one_year_ago).toFixed(2)
                },
                "gold":{
                    "one_month":calc_res(g.current, g.one_month_ago).toFixed(2),
                    "three_months":calc_res(g.current, g.three_months_ago).toFixed(2),
                    "one_year":calc_res(g.current,g.one_year_ago).toFixed(2)
                }
            }
        }

        return Response.json(result)
    } catch (error) {
        console.log(`Error in fetching performance and benchmark ${error}`);
        return new Response(JSON.stringify(`Error in fetching performance and benchmark ${error}`), {"status":500})
    }
}