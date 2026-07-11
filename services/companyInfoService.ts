
export interface CompanyInfoResult {
  title: string;
  summary: string;
  url: string | null;
  foundedYear: string | null;
  headquarters: string | null;
  industry: string | null;
  employeeCount: number | null;
}

export async function fetchCompanyInfo(
  companyName: string
): Promise<CompanyInfoResult> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      companyName + " company"
    )}&format=json&origin=*&srlimit=1`;

    const searchRes  = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const bestMatch  = searchData?.query?.search?.[0]?.title;

    if (!bestMatch) {
      return empty(companyName);
    }

    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestMatch)}`;
    const summaryRes  = await fetch(summaryUrl);
    const summaryData = await summaryRes.json();
    const extract: string = summaryData.extract ?? "";

    return {
      title:        summaryData.title ?? bestMatch,
      summary:      extract,
      url:          summaryData.content_urls?.desktop?.page ?? null,
      foundedYear:  extractFoundedYear(extract),
      headquarters: extractHeadquarters(extract),
      industry:     extractIndustry(extract),
      employeeCount: extractEmployeesFromText(extract),
    };
  } catch (err) {
    console.error("companyInfoService error:", err);
    return empty(companyName);
  }
}


function extractFoundedYear(text: string): string | null {
  const m = text.match(/(?:founded|incorporated|established|formed)\s+(?:in\s+)?(\d{4})/i);
  return m ? m[1] : null;
}

function extractHeadquarters(text: string): string | null {
  const m = text.match(
    /(?:headquartered|headquarters)\s+(?:in\s+)([A-Z][\w]+(?:[\s,]+[A-Z][\w]+){0,2})/
  );
  if (m) {
    return m[1].replace(/\s+(and|the|is|with|by|of|a)\s.*$/i, "").trim().replace(/,?\s*$/, "");
  }
  const m2 = text.match(/\bbased\s+in\s+([A-Z][\w]+(?:[\s,]+[A-Z][\w]+){0,2})/);
  if (m2) return m2[1].replace(/\s+(and|the|is|with|by|of|a)\s.*$/i, "").trim().replace(/,?\s*$/, "");
  return null;
}

export function extractEmployeesFromText(text: string): number | null {
  const m = text.match(/(\d[\d,]+)\s*(?:full[- ]time\s+)?employees/);
  if (!m) return null;
  const n = parseInt(m[1].replace(/,/g, ""), 10);
  return isNaN(n) ? null : n;
}

function extractIndustry(text: string): string | null {
  const lc = text.toLowerCase();
  if (/\b(information technology|it services|software|outsourcing)\b/.test(lc)) return "Information Technology";
  if (/\b(bank|banking|financial services|insurance)\b/.test(lc))               return "Financial Services";
  if (/\b(automobile|automotive|electric vehicle|car manufacturer)\b/.test(lc))  return "Automotive";
  if (/\b(pharmaceutical|drug|biotech|biopharmaceutical)\b/.test(lc))            return "Pharmaceuticals";
  if (/\b(telecom|telecommunications|mobile network)\b/.test(lc))               return "Telecommunications";
  if (/\b(retail|e-commerce|ecommerce|online shopping)\b/.test(lc))             return "Retail / E-Commerce";
  if (/\b(oil|gas|petroleum|energy|mining)\b/.test(lc))                         return "Energy";
  if (/\b(real estate|property|infrastructure)\b/.test(lc))                     return "Real Estate";
  if (/\b(food|beverage|consumer goods|fmcg)\b/.test(lc))                       return "Consumer Goods";
  if (/\b(aviation|airline|aerospace)\b/.test(lc))                              return "Aviation";
  if (/\b(media|entertainment|streaming)\b/.test(lc))                           return "Media & Entertainment";
  return null;
}

function empty(companyName: string): CompanyInfoResult {
  return {
    title:        companyName,
    summary:      `No Wikipedia entry found for "${companyName}".`,
    url:          null,
    foundedYear:  null,
    headquarters: null,
    industry:     null,
    employeeCount: null,
  };
}
