import { AnalysisResult } from '../App';

// Comprehensive prompt analysis and visual description generation engine

export function generateVisualDescription(inputPrompt: string): AnalysisResult {
  const prompt = inputPrompt.trim().toLowerCase();
  const originalPrompt = inputPrompt.trim();

  // Step 1: Extract core elements
  const coreElements = extractCoreElements(originalPrompt, prompt);

  // Step 2: Determine if generative reasoning is needed
  const { requiresGenerativeReasoning, generativeSolution } = analyzeGenerativeReasoning(originalPrompt, prompt);

  // Step 3: Generate enhanced description
  const enhancedDescription = buildEnhancedDescription(coreElements, requiresGenerativeReasoning, generativeSolution, originalPrompt);

  return {
    coreElements,
    requiresGenerativeReasoning,
    generativeSolution,
    enhancedDescription,
  };
}

function extractCoreElements(original: string, lower: string) {
  const subject = extractSubject(original, lower);
  const quantity = extractQuantity(original, lower);
  const action = extractAction(original, lower);
  const state = extractState(original, lower);
  const ipNames = extractIPNames(original);
  const colors = extractColors(original, lower);
  const textElements = extractTextElements(original);

  return { subject, quantity, action, state, ipNames, colors, textElements };
}

function extractSubject(original: string, _lower: string): string {
  // Try to identify the main subject
  const subjectPatterns = [
    /(?:^|\b)(?:a|an|the|one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+([a-z][a-z\s]{2,30}?)(?:\s+(?:is|are|sitting|standing|walking|running|flying|lying|floating|holding|wearing|looking|reading|playing|eating|sleeping|dancing|swimming|jumping|climbing|driving|riding|cooking|working|on|in|at|with|near|behind|in front|above|below|under|over))/i,
    /(?:design|create|make|draw|paint|show|illustrate)\s+(?:a|an|the)?\s*([a-z][a-z\s]{2,30}?)(?:\s+(?:for|with|called|named|titled|showing))/i,
    /(?:^|\b)([a-z][a-z\s]{2,25}?)(?:\s+(?:on|in|at|with|near|behind|under|over|above|below))/i,
  ];

  for (const pattern of subjectPatterns) {
    const match = original.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Fallback: extract noun phrases
  const words = original.split(/\s+/);
  const nouns: string[] = [];
  for (let i = 0; i < words.length; i++) {
    if (i > 0 && /^(a|an|the|one|two|three|\d+)$/i.test(words[i - 1])) {
      nouns.push(words[i]);
    }
  }
  if (nouns.length > 0) return nouns.join(', ');

  return original.split(/[,.;]/)[0].trim();
}

function extractQuantity(original: string, _lower: string): string {
  const quantityPatterns = [
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|\d+)\s+(?:of\s+)?/gi,
    /\b(a|an)\s+/gi,
    /\b(several|many|few|multiple|group of|crowd of|pair of)\b/gi,
  ];

  const quantities: string[] = [];
  for (const pattern of quantityPatterns) {
    const matches = original.match(pattern);
    if (matches) {
      quantities.push(...matches.map(m => m.trim()));
    }
  }

  if (quantities.length > 0) {
    return quantities[0].replace(/^a\s+$/i, '1').replace(/^an\s+$/i, '1');
  }
  return '1 (singular)';
}

function extractAction(original: string, _lower: string): string {
  const actionPatterns = [
    /\b(sitting|standing|walking|running|flying|lying|floating|holding|wearing|looking|reading|playing|eating|sleeping|dancing|swimming|jumping|climbing|driving|riding|cooking|working|smiling|laughing|crying|thinking|pointing|waving|kneeling|crouching|leaning|hanging|falling|rising|spinning|turning|pushing|pulling|throwing|catching)\b/gi,
  ];

  for (const pattern of actionPatterns) {
    const matches = original.match(pattern);
    if (matches) return matches.join(', ');
  }

  // Check for design verbs
  if (/\b(design|create|make|draw|paint|illustrate|build|construct)\b/i.test(original)) {
    return 'design/creation task';
  }

  return 'static/posed';
}

function extractState(original: string, _lower: string): string {
  const statePatterns = [
    /\b(happy|sad|angry|calm|peaceful|energetic|tired|excited|scared|curious|confident|lonely|content|serene|mysterious|dramatic|elegant|rustic|modern|vintage|futuristic|ancient|dark|bright|colorful|monochrome|warm|cold|wet|dry|foggy|clear|cloudy|stormy|sunny|rainy|snowy)\b/gi,
  ];

  for (const pattern of statePatterns) {
    const matches = original.match(pattern);
    if (matches) return matches.join(', ');
  }

  if (/\b(sunset|sunrise|dawn|dusk|night|midnight|morning|afternoon|evening|golden hour|blue hour)\b/i.test(original)) {
    return 'time-of-day lighting condition';
  }

  return 'neutral/default state';
}

function extractIPNames(original: string): string[] {
  const names: string[] = [];

  // Look for quoted names
  const quotedMatches = original.match(/"([^"]+)"/g);
  if (quotedMatches) {
    names.push(...quotedMatches.map(m => m.replace(/"/g, '')));
  }

  // Look for titled/named/called patterns
  const titledPattern = /(?:called|named|titled|labeled)\s+"?([^",.]+)"?/gi;
  let match;
  while ((match = titledPattern.exec(original)) !== null) {
    names.push(match[1].trim());
  }

  // Look for capitalized multi-word names (potential proper nouns)
  const properNounPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g;
  while ((match = properNounPattern.exec(original)) !== null) {
    const candidate = match[1];
    if (!['The', 'A', 'An'].includes(candidate.split(' ')[0])) {
      names.push(candidate);
    }
  }

  return [...new Set(names)];
}

function extractColors(original: string, _lower: string): string[] {
  const colorPatterns = [
    /\b(red|blue|green|yellow|orange|purple|violet|pink|brown|black|white|gray|grey|gold|silver|bronze|cyan|magenta|turquoise|navy|maroon|olive|teal|coral|crimson|scarlet|amber|emerald|sapphire|ruby|ivory|cream|beige|tan|khaki|lavender|indigo|peach|salmon|mint|lime|chartreuse|burgundy|mauve|plum|rust|copper|rose|blush|charcoal|slate|steel)\b/gi,
    /\b(purple and gold|blue and white|red and black|black and white|purple and blue|green and yellow)\b/gi,
    /\b(gradient|gradient background|color gradient)\b/gi,
  ];

  const colors: string[] = [];
  for (const pattern of colorPatterns) {
    const matches = original.match(pattern);
    if (matches) colors.push(...matches);
  }

  return [...new Set(colors)];
}

function extractTextElements(original: string): string[] {
  const texts: string[] = [];

  // Look for quoted text that should appear in the image
  const quotedText = original.match(/"([^"]+)"/g);
  if (quotedText) {
    texts.push(...quotedText.map(t => t.replace(/"/g, '')));
  }

  // Look for text-related instructions
  const textPatterns = [
    /(?:text|label|sign|title|heading|caption|writing|inscription|words)\s+(?:that\s+)?(?:says?|reads?|showing|with|reading)\s+"?([^",.]+)"?/gi,
    /(?:titled|called|named)\s+"?([^",.]+)"?/gi,
  ];

  for (const pattern of textPatterns) {
    let match;
    while ((match = pattern.exec(original)) !== null) {
      const text = match[1].trim();
      if (text && !texts.includes(text)) {
        texts.push(text);
      }
    }
  }

  // Look for menu sections, poster titles, etc.
  const sectionPattern = /(?:sections?|parts?|categories?)\s+(?:for|including|:)\s+([^.]+)/gi;
  let match;
  while ((match = sectionPattern.exec(original)) !== null) {
    const sections = match[1].split(/,|and/).map(s => s.trim());
    texts.push(...sections.filter(s => s.length > 0));
  }

  return [...new Set(texts)];
}

function analyzeGenerativeReasoning(original: string, _lower: string): { requiresGenerativeReasoning: boolean; generativeSolution: string } {
  const designVerbs = /\b(design|create|make|build|construct|develop|plan|layout|compose|arrange)\b/i;
  const conceptVerbs = /\b(show|illustrate|depict|visualize|represent|demonstrate|explain|solve)\b/i;
  const isQuestion = /\b(what|how|where|when|why)\b.*\?/i.test(original);

  if (designVerbs.test(original)) {
    return {
      requiresGenerativeReasoning: true,
      generativeSolution: generateDesignSolution(original),
    };
  }

  if (conceptVerbs.test(original) || isQuestion) {
    return {
      requiresGenerativeReasoning: true,
      generativeSolution: generateConceptSolution(original),
    };
  }

  return {
    requiresGenerativeReasoning: false,
    generativeSolution: '',
  };
}

function generateDesignSolution(original: string): string {
  const isMenu = /menu/i.test(original);
  const isPoster = /poster/i.test(original);
  const isUI = /(?:ui|interface|app|website|dashboard)/i.test(original);
  const isLogo = /logo/i.test(original);

  if (isMenu) {
    return 'The solution is a restaurant menu layout with a vertical structure. The top section contains the restaurant name as a header. Below, content is organized into clearly separated sections (antipasti, pasta, desserts), each with a section header and individual item entries showing dish names and prices. The overall structure follows a clean, readable hierarchy with consistent spacing between sections.';
  }

  if (isPoster) {
    return 'The solution is a vertical poster format with a clear visual hierarchy. The top area features the main title in large, prominent typography. The central area contains the primary visual element (illustration or photograph). The bottom area contains secondary information such as date, venue, and additional details. The background uses the specified color scheme to create visual impact.';
  }

  if (isUI) {
    return 'The solution is a user interface layout with a structured grid system. The interface contains a navigation area, main content area with data display elements, and interactive components. The layout follows standard UI conventions with clear information hierarchy and visual grouping of related elements.';
  }

  if (isLogo) {
    return 'The solution is a logo design with a central symbol or mark, potentially accompanied by a wordmark. The design uses clean geometric shapes and the specified color palette. The composition is balanced and works at multiple scales.';
  }

  return `The solution visualizes the design request "${original}" as a structured composition with clear hierarchy, organized elements, and professional layout principles applied to the specified content.`;
}

function generateConceptSolution(original: string): string {
  return `The solution conceptualizes "${original}" as a specific, visualizable scene. The abstract concept is translated into concrete visual elements: physical objects, spatial relationships, lighting conditions, and material properties that together represent the requested idea in a directly renderable form.`;
}

function buildEnhancedDescription(
  coreElements: AnalysisResult['coreElements'],
  requiresGenerativeReasoning: boolean,
  _generativeSolution: string,
  originalPrompt: string
): string {
  const parts: string[] = [];

  // Determine scene type
  const isDesign = /\b(design|create|make|poster|menu|logo|ui|interface|layout|infographic)\b/i.test(originalPrompt);
  const isScene = /\b(in|on|at|with|near|behind|under|over|above|below|inside|outside)\b/i.test(originalPrompt);
  const isPortrait = /\b(person|man|woman|girl|boy|portrait|face|people)\b/i.test(originalPrompt);

  // Build the description based on scene type
  if (isDesign) {
    parts.push(buildDesignDescription(coreElements, originalPrompt));
  } else if (isPortrait) {
    parts.push(buildPortraitDescription(coreElements, originalPrompt));
  } else if (isScene) {
    parts.push(buildSceneDescription(coreElements, originalPrompt));
  } else {
    parts.push(buildGeneralDescription(coreElements, originalPrompt));
  }

  // Add composition details
  parts.push('');
  parts.push(buildCompositionDescription(isDesign, isPortrait, isScene));

  // Add lighting and atmosphere
  parts.push('');
  parts.push(buildLightingDescription(originalPrompt));

  // Add material and texture details
  parts.push('');
  parts.push(buildMaterialDescription(originalPrompt, isDesign));

  // Add color palette
  parts.push('');
  parts.push(buildColorDescription(coreElements.colors, originalPrompt));

  // Add spatial depth
  parts.push('');
  parts.push(buildSpatialDescription(isDesign, isScene));

  // Handle text elements
  if (coreElements.textElements.length > 0) {
    parts.push('');
    parts.push(buildTextDescription(coreElements.textElements, originalPrompt, isDesign));
  }

  return parts.filter(p => p !== '' || parts.indexOf(p) === 0).join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

function buildDesignDescription(coreElements: AnalysisResult['coreElements'], originalPrompt: string): string {
  const isMenu = /menu/i.test(originalPrompt);
  const isPoster = /poster/i.test(originalPrompt);

  if (isMenu) {
    let desc = `A restaurant menu document displayed flat on a surface, viewed from above at a slight angle. The menu has a rectangular format with rounded corners. At the top center, the restaurant name "${coreElements.textElements.find(t => /bella|vista|restaurant|cafe|bar/i.test(t)) || coreElements.ipNames[0] || 'Restaurant Name'}" is displayed in elegant serif typography. Below the name, the menu is divided into clearly labeled sections.`;

    if (coreElements.textElements.length > 0) {
      desc += ` The sections present are: `;
      const sections = coreElements.textElements.filter(t => /antipasti|pasta|dessert|appetizer|main|drink|beverage/i.test(t));
      if (sections.length > 0) {
        desc += sections.map(s => `"${s}"`).join(', ');
      } else {
        desc += coreElements.textElements.map(t => `"${t}"`).join(', ');
      }
      desc += `. Each section has a bold header followed by individual dish entries with the dish name on the left and the price aligned to the right. The entries are separated by thin horizontal rules or whitespace.`;
    }

    return desc;
  }

  if (isPoster) {
    let desc = `A vertical poster with a portrait orientation. The poster features a prominent visual composition in the center. `;

    if (coreElements.textElements.length > 0) {
      const title = coreElements.textElements[0];
      desc += `At the top, the title "${title}" is displayed in large, bold typography with a decorative font style. `;
    }

    desc += `The main visual element occupies the central 60% of the poster. `;

    if (coreElements.subject) {
      desc += `The primary visual depicts ${coreElements.subject}. `;
    }

    if (coreElements.colors.length > 0) {
      desc += `The background uses a ${coreElements.colors.join(' and ')} gradient, transitioning smoothly from the top to the bottom of the poster. `;
    }

    desc += `At the bottom, secondary information (date, venue, ticket details) is displayed in smaller, clean sans-serif typography. The overall layout has generous margins and clear visual hierarchy.`;

    return desc;
  }

  return `A design composition displayed in a clean presentation format. The design features ${coreElements.subject} as the primary element, arranged with professional layout principles. The composition has clear visual hierarchy with the most important elements positioned prominently. Spacing between elements is consistent and intentional. The overall format is ${coreElements.quantity === '1 (singular)' ? 'a single cohesive piece' : coreElements.quantity + ' elements arranged in a structured layout'}.`;
}

function buildPortraitDescription(coreElements: AnalysisResult['coreElements'], originalPrompt: string): string {
  let desc = `${coreElements.quantity !== '1 (singular)' ? coreElements.quantity + ' figures' : 'A figure'} of ${coreElements.subject}`;

  if (coreElements.action !== 'static/posed') {
    desc += ` ${coreElements.action}`;
  }

  desc += `. The subject is positioned according to the rule of thirds, placed slightly off-center in the frame. `;

  // Add setting context
  const settingMatch = originalPrompt.match(/(?:in|on|at|inside|near)\s+(?:a|an|the)?\s*([^.]+)/i);
  if (settingMatch) {
    desc += `The setting is ${settingMatch[1].trim()}. `;
  }

  // Add time of day
  const timeMatch = originalPrompt.match(/\b(sunset|sunrise|dawn|dusk|night|midnight|morning|afternoon|evening|golden hour|blue hour)\b/i);
  if (timeMatch) {
    desc += `The scene takes place during ${timeMatch[1].toLowerCase()}. `;
  }

  return desc;
}

function buildSceneDescription(coreElements: AnalysisResult['coreElements'], originalPrompt: string): string {
  let desc = `${coreElements.quantity !== '1 (singular)' ? coreElements.quantity + ' instances of' : 'A'} ${coreElements.subject}`;

  if (coreElements.action !== 'static/posed') {
    desc += ` ${coreElements.action}`;
  }

  desc += `. `;

  // Add environment
  const envPatterns = [
    /(?:in|on|at|inside|near|behind|under|over)\s+(?:a|an|the)?\s*([^.]+?)(?:\s+(?:with|during|at|during|$))/i,
    /(?:in|on|at)\s+(?:a|an|the)?\s*([^.]+)$/i,
  ];

  for (const pattern of envPatterns) {
    const match = originalPrompt.match(pattern);
    if (match) {
      desc += `The environment is ${match[1].trim()}. `;
      break;
    }
  }

  // Add time
  const timeMatch = originalPrompt.match(/\b(sunset|sunrise|dawn|dusk|night|midnight|morning|afternoon|evening|golden hour|blue hour)\b/i);
  if (timeMatch) {
    desc += `The time is ${timeMatch[1].toLowerCase()}. `;
  }

  // Add weather/atmosphere
  const weatherMatch = originalPrompt.match(/\b(rain|snow|fog|mist|storm|wind|clouds|clear sky|overcast)\b/i);
  if (weatherMatch) {
    desc += `Weather condition: ${weatherMatch[1].toLowerCase()}. `;
  }

  return desc;
}

function buildGeneralDescription(coreElements: AnalysisResult['coreElements'], _originalPrompt: string): string {
  let desc = `${coreElements.quantity !== '1 (singular)' ? coreElements.quantity + ' instances of' : 'A'} ${coreElements.subject}`;

  if (coreElements.action !== 'static/posed') {
    desc += ` ${coreElements.action}`;
  }

  desc += `. The subject is rendered with precise physical detail and accurate proportions. `;
  desc += `The state is ${coreElements.state}.`;

  return desc;
}

function buildCompositionDescription(isDesign: boolean, isPortrait: boolean, isScene: boolean): string {
  if (isDesign) {
    return 'Composition: Structured layout with clear visual hierarchy. Primary elements occupy the central focal area. Secondary elements are arranged with consistent margins and alignment. The grid system maintains proportional relationships between all elements. White space is used deliberately to separate content groups and guide the viewer\'s eye through the design.';
  }

  if (isPortrait) {
    return 'Composition: The subject is framed using the rule of thirds, positioned at one of the intersection points. The background provides context without competing for attention. Leading lines in the environment direct the viewer\'s gaze toward the subject. The depth of field separates the subject from the background, creating visual isolation.';
  }

  if (isScene) {
    return 'Composition: The scene is arranged with a clear foreground, middle ground, and background layer. The primary subject is positioned using the rule of thirds or centered for symmetrical impact. Environmental elements create framing and depth. The viewer\'s eye is guided through the scene via implied lines and spatial relationships between objects.';
  }

  return 'Composition: The subject is centered in the frame with balanced negative space on all sides. The arrangement creates a clear focal point with supporting elements distributed to maintain visual equilibrium.';
}

function buildLightingDescription(originalPrompt: string): string {
  const timeMatch = originalPrompt.match(/\b(sunset|sunrise|dawn|dusk|night|midnight|morning|evening|golden hour|blue hour)\b/i);
  const weatherMatch = originalPrompt.match(/\b(rain|fog|mist|overcast|storm)\b/i);

  let desc = 'Lighting: ';

  if (timeMatch) {
    const time = timeMatch[1].toLowerCase();
    switch (time) {
      case 'sunset':
      case 'golden hour':
        desc += 'Warm directional light from a low angle on the horizon. The light has an orange-to-amber color temperature (approximately 2700K). Long shadows extend across surfaces. The light creates rim lighting on edges facing the light source. The sky displays a gradient from deep orange near the horizon to purple-blue at the zenith.';
        break;
      case 'sunrise':
      case 'dawn':
        desc += 'Soft directional light from a low eastern angle. The light has a cool-to-warm transition with pink and pale gold tones (approximately 3200K). Shadows are long but soft. Atmospheric haze diffuses the light creating a gentle glow.';
        break;
      case 'dusk':
      case 'blue hour':
        desc += 'Ambient light with a predominantly blue color temperature (approximately 7500K). The sky transitions from deep blue to purple. Artificial light sources (if present) create warm pools of light contrasting with the cool ambient. Shadows are soft and diffused.';
        break;
      case 'night':
      case 'midnight':
        desc += 'Low ambient light with cool blue-black tones. Point light sources create strong contrast between illuminated areas and deep shadows. If moonlight is present, it provides a cool silver-white directional light from above. Stars may be visible in the sky.';
        break;
      case 'morning':
        desc += 'Bright, clean directional light from a medium angle. Color temperature approximately 5000K. Shadows are defined but not harsh. The overall scene has high clarity and saturation.';
        break;
      case 'afternoon':
        desc += 'Strong overhead directional light. Color temperature approximately 5500K. Shadows are short and well-defined. High contrast between lit and shadowed surfaces.';
        break;
      case 'evening':
        desc += 'Warm ambient light transitioning to cooler tones. Color temperature approximately 3500K. The light has a soft quality with moderate shadow definition.';
        break;
      default:
        desc += 'Natural ambient lighting appropriate to the time specified.';
    }
  } else if (weatherMatch) {
    const weather = weatherMatch[1].toLowerCase();
    switch (weather) {
      case 'rain':
        desc += 'Diffused, overcast lighting with no direct sun. The light is soft and even with minimal shadow definition. Wet surfaces create specular reflections. The overall color temperature is cool (approximately 6500K). Rain droplets catch and refract available light.';
        break;
      case 'fog':
      case 'mist':
        desc += 'Heavily diffused lighting with reduced contrast. The fog scatters light uniformly, eliminating harsh shadows. Distant elements fade into the fog with decreasing saturation and contrast (atmospheric perspective). Color temperature is neutral to slightly cool.';
        break;
      case 'storm':
        desc += 'Dark, dramatic lighting with low overall illumination. Heavy cloud cover blocks direct light. Occasional bright flashes create extreme contrast. The color palette is dominated by dark grays and muted tones.';
        break;
      default:
        desc += 'Natural lighting conditions appropriate to the weather described.';
    }
  } else {
    desc += 'Balanced, professional lighting with a three-point setup: key light from the upper left at 45 degrees providing the primary illumination, fill light from the opposite side at lower intensity to soften shadows, and a subtle backlight creating separation from the background. The color temperature is neutral (5000K). Shadow edges are soft with gradual falloff.';
  }

  return desc;
}

function buildMaterialDescription(originalPrompt: string, isDesign: boolean): string {
  if (isDesign) {
    const isMenu = /menu/i.test(originalPrompt);
    if (isMenu) {
      return 'Materials: The menu is printed on thick, cream-colored cardstock with a slight texture visible on the surface. The paper has a matte finish with minimal light reflection. Text is printed in dark ink with crisp edges. If the menu is displayed on a surface, the surface is a dark wood table with visible grain pattern, or a clean marble countertop with subtle veining.';
    }
    return 'Materials: The design elements use clean, flat surfaces with precise edges. Typography is rendered with sharp anti-aliased edges. Colors are saturated and uniform within their boundaries. The overall presentation has a professional, polished finish.';
  }

  let desc = 'Materials and textures: ';

  if (/\b(glass|window|mirror)\b/i.test(originalPrompt)) {
    desc += 'Glass surfaces have high transparency with subtle reflections showing the environment. The glass has slight green tint at the edges. Surface shows fingerprints or water droplets for realism. ';
  }

  if (/\b(metal|steel|chrome|iron)\b/i.test(originalPrompt)) {
    desc += 'Metal surfaces have a brushed or polished finish with anisotropic reflections. The metal shows subtle scratches and wear marks. Edge highlights catch the light creating bright specular lines. ';
  }

  if (/\b(wood|tree|forest)\b/i.test(originalPrompt)) {
    desc += 'Wood surfaces display visible grain patterns with variations in color density. The wood has a semi-matte finish with subtle warmth. Knots and natural imperfections are visible. ';
  }

  if (/\b(water|ocean|sea|river|lake|pool)\b/i.test(originalPrompt)) {
    desc += 'Water surfaces show realistic wave patterns with caustic light effects on submerged surfaces. The water has depth-dependent color shift from light turquoise at the surface to deep blue-green at depth. Surface tension creates meniscus effects at edges. ';
  }

  if (/\b(stone|rock|mountain|cliff)\b/i.test(originalPrompt)) {
    desc += 'Stone surfaces have rough, irregular textures with visible mineral deposits and weathering. Color variations occur naturally across the surface. Cracks and fissures add depth. ';
  }

  if (/\b(fabric|cloth|textile|cushion|pillow|blanket)\b/i.test(originalPrompt)) {
    desc += 'Fabric surfaces show woven texture patterns with visible thread direction. The material drapes naturally with soft folds creating shadow gradients. Surface has a matte quality with minimal specular reflection. ';
  }

  if (desc === 'Materials and textures: ') {
    desc += 'All surfaces are rendered with physically accurate material properties. Objects have appropriate surface roughness, reflectivity, and subsurface scattering based on their material type. Micro-details such as surface imperfections, dust particles, and subtle wear are present for realism. Each material responds correctly to the lighting conditions.';
  }

  return desc;
}

function buildColorDescription(explicitColors: string[], originalPrompt: string): string {
  let desc = 'Color palette: ';

  if (explicitColors.length > 0) {
    desc += `The specified colors are ${explicitColors.join(', ')}. `;

    if (explicitColors.length >= 2) {
      desc += `These colors form the dominant palette, with ${explicitColors[0]} as the primary color and ${explicitColors[1]} as the secondary accent. `;
    }

    desc += 'Color transitions between these values are smooth and gradual. The saturation level is high for focal elements and reduced for background areas to create depth.';
  } else {
    // Infer color scheme from context
    if (/\b(sunset|golden hour|warm)\b/i.test(originalPrompt)) {
      desc += 'Warm color palette dominated by amber, orange, and gold tones. Secondary colors include deep purple and blue in shadow areas. The overall temperature is warm (2700-3500K). Highlights are bright yellow-white.';
    } else if (/\b(night|midnight|dark)\b/i.test(originalPrompt)) {
      desc += 'Cool, dark color palette with deep blues, indigos, and blacks. Accent colors appear as point-light sources in warm tones. The overall temperature is cool (7000K+). Contrast is high between illuminated and shadowed areas.';
    } else if (/\b(forest|nature|garden|tree)\b/i.test(originalPrompt)) {
      desc += 'Natural color palette with dominant greens, earth browns, and organic tones. Accent colors include sky blue and warm sunlight yellows. The saturation is moderate with natural variation. Greens range from yellow-green in sunlit areas to blue-green in shadows.';
    } else if (/\b(ocean|sea|beach|water)\b/i.test(originalPrompt)) {
      desc += 'Aquatic color palette with dominant blues, teals, and cyans. Sand areas provide warm beige and tan contrast. The sky contributes white and pale blue. Water depth creates a gradient from light turquoise to deep navy.';
    } else if (/\b(cozy|warm|indoor|room|library)\b/i.test(originalPrompt)) {
      desc += 'Warm interior palette with amber, cream, and brown tones. Wood surfaces contribute rich browns. Fabric and soft materials add muted warm accents. The overall temperature is warm (3000K) creating a comfortable atmosphere.';
    } else {
      desc += 'Balanced, naturalistic color palette with accurate hue reproduction. Saturation is moderate to high for the main subject, with desaturated tones in peripheral areas. Color harmony follows analogous or complementary relationships. White balance is neutral.';
    }
  }

  return desc;
}

function buildSpatialDescription(isDesign: boolean, isScene: boolean): string {
  if (isDesign) {
    return 'Spatial arrangement: The design exists in a flat, two-dimensional plane viewed straight-on. All elements maintain precise alignment to an invisible grid. Margins are consistent on all sides. The spatial relationship between elements follows a clear hierarchy: largest/most important elements are positioned first, with supporting elements arranged around them at proportional distances.';
  }

  if (isScene) {
    return 'Spatial depth: The scene has three distinct depth layers. The foreground layer (closest to the viewer) contains detailed elements with high contrast and warm color temperature. The middle ground contains the primary subject at medium detail level. The background layer shows reduced contrast, cooler color temperature, and less detail due to atmospheric perspective. The depth of field creates a gradual focus falloff from the focal plane.';
  }

  return 'Spatial arrangement: The subject occupies the central volume of the frame. Surrounding space provides breathing room and context. The perspective is slightly below eye level, looking up at approximately 5 degrees, giving the subject a sense of presence. Depth cues include size scaling, overlap, and atmospheric perspective.';
}

function buildTextDescription(textElements: string[], originalPrompt: string, isDesign: boolean): string {
  let desc = 'Text elements in the image:\n';

  if (isDesign) {
    const isMenu = /menu/i.test(originalPrompt);
    const isPoster = /poster/i.test(originalPrompt);

    if (isMenu) {
      desc += `- The restaurant name is displayed at the top center in an elegant serif font (similar to Playfair Display or Cormorant Garamond), size approximately 24pt relative to the menu dimensions, in dark brown or black color.\n`;
      desc += `- Section headers ("${textElements.join('", "')}") are displayed in bold sans-serif font (similar to Montserrat or Lato), size approximately 14pt, uppercase with letter-spacing, positioned above their respective content sections.\n`;
      desc += `- Individual dish names are in regular weight sans-serif, size approximately 11pt, left-aligned within their section.\n`;
      desc += `- Prices are in the same font as dish names, right-aligned, separated from dish names by a row of dots or a thin line.`;
    } else if (isPoster) {
      desc += `- The main title "${textElements[0] || 'Title'}" is displayed in large, bold typography occupying approximately 15-20% of the poster height. The font is decorative and attention-grabbing, with tight or expanded letter-spacing depending on the design style.\n`;
      if (textElements.length > 1) {
        desc += `- Secondary text elements include: ${textElements.slice(1).map(t => `"${t}"`).join(', ')} displayed in smaller, clean sans-serif typography at the bottom of the poster.\n`;
      }
      desc += `- All text has sufficient contrast against its background for readability.`;
    } else {
      desc += textElements.map(t => `- "${t}" is displayed in clean, legible typography with appropriate sizing for its position in the layout.`).join('\n');
    }
  } else {
    desc += textElements.map(t => `- The text "${t}" appears in the image, rendered in a legible font with clear contrast against its background. The text is positioned ${getTextPosition(t, originalPrompt)}.`).join('\n');
  }

  return desc;
}

function getTextPosition(text: string, originalPrompt: string): string {
  if (/sign|board|placard/i.test(originalPrompt)) return 'on a sign or board within the scene';
  if (/screen|monitor|display/i.test(originalPrompt)) return 'on a screen or display surface';
  if (/label|tag/i.test(originalPrompt)) return 'on a label attached to an object';
  if (/top|header|title/i.test(originalPrompt)) return 'at the top of the composition';
  if (/bottom|footer/i.test(originalPrompt)) return 'at the bottom of the composition';
  return 'in a position consistent with the scene layout';
}
