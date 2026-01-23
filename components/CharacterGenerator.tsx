'use client';

import { useState } from 'react';

interface CharacterGeneratorProps {
  onGenerated: (imageBlob: Blob, metadata: CharacterMetadata, lore: string) => void;
}

interface CharacterMetadata {
  name: string;
  description: string;
  attributes: {
    cuteness: number;
    confidence: number;
    tiliFactor: number;
    luzon: number;
    visayas: number;
    mindanao: number;
    hairAmount: number;
    facialHair: number;
    clothingStyle: number;
    hairColor: number;
    eyewear: number;
    skinColor: number;
    bodyFat: number;
    posture: number;
    holdingItem: string;
  };
}

export function CharacterGenerator({ onGenerated }: CharacterGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [characterName, setCharacterName] = useState('');
  const [cuteness, setCuteness] = useState(50);
  const [confidence, setConfidence] = useState(50);
  const [tiliFactor, setTiliFactor] = useState(50);
  const [luzon, setLuzon] = useState(0);
  const [visayas, setVisayas] = useState(0);
  const [mindanao, setMindanao] = useState(0);
  const [hairAmount, setHairAmount] = useState(25);
  const [facialHair, setFacialHair] = useState(0);
  const [clothingStyle, setClothingStyle] = useState(25);
  const [hairColor, setHairColor] = useState(0);
  const [eyewear, setEyewear] = useState(0);
  const [skinColor, setSkinColor] = useState(0);
  const [bodyFat, setBodyFat] = useState(25);
  const [posture, setPosture] = useState(25);
  const [holdingItem, setHoldingItem] = useState('None');

  /**
   * Generate Filipino name using the API route
   */
  const generateName = async (): Promise<string> => {
    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'name',
          prompt: 'Generate a single unique and creative name for a Filipino male character. The name should be a traditional or modern Filipino name. Do not include any other text, just the name.'
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate name');
      
      const result = await response.json();
      return result.text?.replace(/["']+/g, '') || "Pogi";
    } catch (e) {
      console.error("Name generation failed:", e);
      return "Pogi";
    }
  };

  /**
   * Generate country name using the API route
   */
  const generateCountry = async (): Promise<string> => {
    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'country',
          prompt: 'Generate a name of a foreign country, do not include any other text.'
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate country');
      
      const result = await response.json();
      return result.text?.replace(/["']+/g, '') || "a foreign land";
    } catch (e) {
      console.error("Country generation failed:", e);
      return "a foreign land";
    }
  };

  /**
   * Generate lore text using the API route
   */
  const generateLore = async (name: string, originDesc: string): Promise<string> => {
    try {
      const promptText = `
        You are a lore generator for a fictional universe called "Kapogian Chibis".
        A Kapogian Chibi is a confident, good-looking Filipino male.
        Their stats are: Cuteness is ${cuteness} out of 100, Confidence is ${confidence} out of 100, and Tili Factor is ${tiliFactor} out of 100.
        Create a detailed lore for a Kapogian Chibi named **${name}**, a ${originDesc}.
        The lore should be about 150 words and include a backstory, personality description influenced by their stats, a heroic anecdote, and a concluding sentence.
        Do not mention the exact stat numbers in the narrative. Focus on the creative description.
        Use markdown formatting like bolding and italics to make the text stylish.`;

      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'lore',
          prompt: promptText
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate lore');
      
      const result = await response.json();
      return result.text || 'Failed to generate lore.';
    } catch (e) {
      console.error("Lore generation failed:", e);
      return 'Failed to generate lore.';
    }
  };

  /**
   * Build character prompt
   */
  const buildCharacterPrompt = (name: string, originDesc: string): string => {
    let statDescriptors = "";
    
    if (cuteness > 75) {
      statDescriptors += ", large innocent eyes, soft round face";
    } else if (cuteness < 25) {
      statDescriptors += ", mischievous smile, slightly narrowed eyes";
    }

    if (confidence > 75) {
      statDescriptors += ", a bold and smirking pose, puffed-out chest";
    } else if (confidence < 25) {
      statDescriptors += ", a shy and uncertain smile, hands in pockets";
    }

    if (tiliFactor > 75) {
      statDescriptors += ", a heart-throb hairstyle, dazzling infectious smile";
    } else if (tiliFactor < 25) {
      statDescriptors += ", a subtle, cool expression, reserved vibe";
    }

    let hairDescriptor = "medium length hair";
    if (hairAmount <= 5) hairDescriptor = "bald";
    else if (hairAmount <= 15) hairDescriptor = "short spiky hair";
    else if (hairAmount <= 35) hairDescriptor = "medium length hair";
    else hairDescriptor = "long, flowing hair";

    let facialHairDescriptor = "clean shaven";
    if (facialHair > 5) facialHairDescriptor = "light stubble";
    if (facialHair > 20) facialHairDescriptor = "short, neat beard";
    if (facialHair > 40) facialHairDescriptor = "long, full beard and a stylish mustache";

    let clothingDescriptor = "casual streetwear";
    if (clothingStyle <= 5) clothingDescriptor = "only a sando and shorts";
    else if (clothingStyle <= 15) clothingDescriptor = "simple t-shirt and shorts";
    else if (clothingStyle <= 30) clothingDescriptor = "stylish streetwear with a hoodie";
    else if (clothingStyle <= 45) clothingDescriptor = "formal attire with a crisp polo";
    else clothingDescriptor = "elegant filipino formal attire, like a barong tagalog";
    
    let hairColorDescriptor = "black hair";
    if (hairColor > 5) hairColorDescriptor = "dark brown hair";
    if (hairColor > 15) hairColorDescriptor = "light brown hair";
    if (hairColor > 30) hairColorDescriptor = "blonde hair";
    if (hairColor > 45) hairColorDescriptor = "white hair";

    let eyewearDescriptor = "no eyewear";
    if (eyewear > 5) eyewearDescriptor = "stylish eyeglasses";
    if (eyewear > 20) eyewearDescriptor = "cool sunglasses";
    if (eyewear > 40) eyewearDescriptor = "futuristic sporty eyewear";
    
    let skinColorDescriptor = "kayumangi skin";
    if (skinColor > 25) skinColorDescriptor = "dark-skinned, Aeta-like skin color";
    
    let bodyFatDescriptor = "";
    if (bodyFat <= 15) bodyFatDescriptor = "thin and slender body";
    else if (bodyFat <= 35) bodyFatDescriptor = "average body type";
    else bodyFatDescriptor = "chubby and plump body";
    
    let postureDescriptor = "";
    if (cuteness > 30 && confidence > 30) {
      if (posture === 50) {
        postureDescriptor = "striking a finger heart pose with a proud smile";
      } else if (posture >= 20) {
        postureDescriptor = "flexing his muscles and striking a charismatic pose";
      } else {
        postureDescriptor = "with a casual, charming pose, slightly flexing";
      }
    } else {
      if (posture === 50) {
        postureDescriptor = "standing very well-postured and proud";
      } else if (posture > 20) {
        postureDescriptor = "with an upright, well-postured stance";
      } else {
        postureDescriptor = "with a very casual, relaxed posture";
      }
    }
    
    let holdingItemDescriptor = "not holding anything";
    switch (holdingItem) {
      case 'Cash':
        holdingItemDescriptor = "holding a wad of cash";
        break;
      case 'Random Food':
        holdingItemDescriptor = "holding a plate of random Filipino food like Chicken Adobo, Pork BBQ, and Lechon";
        break;
      case 'Random Bouquet of Flowers':
        holdingItemDescriptor = "holding a random bouquet of flowers, including roses, tulips, and sunflowers";
        break;
      case 'Random Home Utensils':
        holdingItemDescriptor = "holding a random home utensil, such as a broomstick or a pan";
        break;
    }

    return `full body shot of a cute chubby chibi pinoy boy named ${name}, ${originDesc}, with ${skinColorDescriptor}, with ${hairColorDescriptor} and ${hairDescriptor}, ${facialHairDescriptor}, wearing ${clothingDescriptor}, with ${eyewearDescriptor}, ${bodyFatDescriptor}, ${postureDescriptor}, ${holdingItemDescriptor}, showing confident pose, smiling. Kapogian meme, high quality, digital art, 4k, simple white background.`;
  };

  /**
   * Main generate handler (exactly like JS version)
   */
  const handleGenerate = async () => {
    // If no character name is provided, generate one using the AI.
    let nameToUse = characterName;
    if (!nameToUse) {
      setLoading(true);
      setError('');
      nameToUse = await generateName();
      setCharacterName(nameToUse);
    }

    // Determine the character's origin (exactly like JS version)
    let originDescription = "Filipino";
    if (luzon === 0 && visayas === 0 && mindanao === 0) {
      const origin = await generateCountry();
      originDescription = `a naturalized Filipino from ${origin}`;
    } else {
      const origins = [
        { region: "Luzon", value: luzon },
        { region: "Visayas", value: visayas },
        { region: "Mindanao", value: mindanao }
      ];
      origins.sort((a, b) => b.value - a.value);
      originDescription = `a native of the ${origins[0].region} region of the Philippines`;
    }

    // Reset state and show loading indicator
    setError('');
    setLoading(true);

    try {
      const fullPrompt = buildCharacterPrompt(nameToUse, originDescription);

      // Generate both image and lore in parallel
      const imagePromise = fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      });

      const lorePromise = generateLore(nameToUse, originDescription);

      const [imageResponse, lore] = await Promise.all([imagePromise, lorePromise]);

      if (!imageResponse.ok) {
        throw new Error('Failed to generate image');
      }

      const result = await imageResponse.json();
      const base64Data = result?.base64Image;
      
      if (!base64Data) {
        throw new Error('No image data received from the API.');
      }

      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const imageBlob = new Blob([byteArray], { type: 'image/png' });

      const metadata: CharacterMetadata = {
        name: nameToUse,
        description: `A Kapogian character from ${originDescription}`,
        attributes: {
          cuteness,
          confidence,
          tiliFactor,
          luzon,
          visayas,
          mindanao,
          hairAmount,
          facialHair,
          clothingStyle,
          hairColor,
          eyewear,
          skinColor,
          bodyFat,
          posture,
          holdingItem,
        },
      };

      onGenerated(imageBlob, metadata, lore);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setError(err.message || 'Failed to generate character. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center" style={{
        background: 'linear-gradient(to right, #9333ea, #ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Generate Your Character
      </h2>

      <div>
        <label className="block text-sm font-medium mb-2">Character Name</label>
        <input
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Leave blank to generate random Filipino name"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      <h3 className="text-xl font-bold mt-6">Kapogian Enchantments</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Cuteness: <span className="text-purple-600">{cuteness}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={cuteness}
            onChange={(e) => setCuteness(Number(e.target.value))}
            className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Confidence: <span className="text-indigo-600">{confidence}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Tili Factor: <span className="text-pink-600">{tiliFactor}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={tiliFactor}
            onChange={(e) => setTiliFactor(Number(e.target.value))}
            className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <h3 className="text-xl font-bold mt-6">Birth Enchantments</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Luzon: {luzon}</label>
          <input
            type="range"
            min="0"
            max="50"
            value={luzon}
            onChange={(e) => setLuzon(Number(e.target.value))}
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Visayas: {visayas}</label>
          <input
            type="range"
            min="0"
            max="50"
            value={visayas}
            onChange={(e) => setVisayas(Number(e.target.value))}
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Mindanao: {mindanao}</label>
          <input
            type="range"
            min="0"
            max="50"
            value={mindanao}
            onChange={(e) => setMindanao(Number(e.target.value))}
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <h3 className="text-xl font-bold mt-6">Porma</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Hair Amount: {hairAmount}</label>
          <input type="range" min="0" max="50" value={hairAmount} onChange={(e) => setHairAmount(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Facial Hair: {facialHair}</label>
          <input type="range" min="0" max="50" value={facialHair} onChange={(e) => setFacialHair(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Clothing: {clothingStyle}</label>
          <input type="range" min="0" max="50" value={clothingStyle} onChange={(e) => setClothingStyle(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Hair Color: {hairColor}</label>
          <input type="range" min="0" max="50" value={hairColor} onChange={(e) => setHairColor(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Eyewear: {eyewear}</label>
          <input type="range" min="0" max="50" value={eyewear} onChange={(e) => setEyewear(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Skin Color: {skinColor}</label>
          <input type="range" min="0" max="50" value={skinColor} onChange={(e) => setSkinColor(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Body Fat: {bodyFat}</label>
          <input type="range" min="0" max="50" value={bodyFat} onChange={(e) => setBodyFat(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Posture: {posture}</label>
          <input type="range" min="0" max="50" value={posture} onChange={(e) => setPosture(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Holding Item</label>
          <select value={holdingItem} onChange={(e) => setHoldingItem(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
            <option value="None">Nothing</option>
            <option value="Cash">Cash</option>
            <option value="Random Food">Filipino Food</option>
            <option value="Random Bouquet of Flowers">Flowers</option>
            <option value="Random Home Utensils">Home Utensils</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-4 text-white font-bold rounded-xl disabled:opacity-50 transition-all hover:scale-105 shadow-lg"
        style={{ background: 'linear-gradient(to right, #9333ea, #ec4899)' }}
      >
        {loading ? '🎨 Generating...' : '✨ Generate Character'}
      </button>

      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}