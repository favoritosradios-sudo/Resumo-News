import { GoogleGenAI } from "@google/genai";
import { Category, NewsArticle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const fetchHeadlines = async (category: Category): Promise<NewsArticle[]> => {
  try {
    const model = 'gemini-2.5-flash';
    
    let promptContext = "";
    if (category === Category.GOSSIP) {
      promptContext = "Busque as últimas fofocas, polêmicas e notícias sobre celebridades brasileiras, influenciadores e TV.";
    } else if (category === Category.GOSPEL) {
      promptContext = "Busque as últimas notícias do mundo cristão, evangélico, música gospel e igrejas no Brasil.";
    } else if (category === Category.HOME) {
      promptContext = "Busque as notícias mais importantes e urgentes do Brasil e do mundo agora.";
    } else {
      promptContext = `Busque as últimas notícias sobre ${category} no Brasil.`;
    }

    const prompt = `
      ${promptContext}
      
      Liste exatamente 5 notícias recentes e REAIS encontradas na busca.
      
      Para CADA notícia, gere um objeto JSON com os seguintes campos:
      1. title: Um título jornalístico completo e informativo.
      2. sourceName: O nome da fonte original (ex: G1, UOL, CNN, Folha).
      3. publishedTime: A data e hora da publicação original que você encontrar (ex: "Hoje às 14:30", "Ontem 18:00", "12/05 - 10h"). Se não encontrar hora exata, estime com base no "há x horas".
      4. summary: Um TEXTO NARRATIVO LONGO e DETALHADO (mínimo de 700 e máximo de 800 caracteres).
      
      REGRAS CRUCIAIS PARA O TEXTO (summary):
      - NÃO UTILIZE ASPAS PARA CITAÇÕES. Transforme todas as falas em discurso indireto (ex: em vez de dizer "O presidente disse: 'Vou assinar'", diga "O presidente afirmou que assinaria o documento").
      - O texto deve ser corrido, sem tópicos, explicando o contexto, o desenrolar e as consequências do fato.
      - Evite termos sensacionalistas, mantenha o tom jornalístico sério (ou leve para fofocas, mas narrativo).
      
      Formate a resposta ESTRITAMENTE como um array JSON de objetos.
      Estrutura:
      [
        { 
          "title": "...", 
          "sourceName": "...", 
          "publishedTime": "...",
          "summary": "Texto longo narrativo sem citações..." 
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "[]";
    
    // Clean up markdown code blocks if present
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData: any[] = [];
    try {
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini", text);
      return [];
    }

    // Map to our NewsArticle type
    return parsedData.map((item, index) => ({
      id: generateId(),
      title: item.title,
      subtitle: undefined, // Removed per request
      sourceName: item.sourceName,
      category: category,
      summary: item.summary,
      imageUrl: undefined,
      publishedTime: item.publishedTime || "Recentemente" 
    }));

  } catch (error) {
    console.error("Error fetching headlines:", error);
    // Fallback data in case of API failure
    return [
      {
        id: 'error-1',
        title: 'Não foi possível carregar as notícias agora',
        subtitle: 'Verifique sua conexão ou tente novamente mais tarde.',
        category: category,
        sourceName: 'Sistema',
        summary: 'Ocorreu um erro ao conectar com o serviço de notícias. Por favor, tente recarregar a página em alguns instantes.',
        isLoadingSummary: false,
        publishedTime: 'Agora'
      }
    ];
  }
};

// Deprecated
export const generateArticleSummary = async (article: NewsArticle): Promise<string> => {
  return article.summary || "Resumo indisponível.";
};