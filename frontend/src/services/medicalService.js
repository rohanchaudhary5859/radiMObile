export async function createCase(body){ return fetch(`${process.env.FUNCTIONS_URL||''}/createcase`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}); }
export async function searchDrug(q){ return fetch(`${process.env.FUNCTIONS_URL||''}/searchdrug`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({q})}); }
