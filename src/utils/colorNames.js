// Human-readable color names based on common color names
// Covers ~150 named CSS/web colors + some common design terms

const COLOR_NAMES = [
  // Reds
  { name: 'Maroon', hex: '#800000' },
  { name: 'Dark Red', hex: '#8B0000' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Crimson', hex: '#DC143C' },
  { name: 'Indian Red', hex: '#CD5C5C' },
  { name: 'Light Coral', hex: '#F08080' },
  { name: 'Salmon', hex: '#FA8072' },
  { name: 'Dark Salmon', hex: '#E9967A' },
  { name: 'Light Salmon', hex: '#FFA07A' },
  { name: 'Firebrick', hex: '#B22222' },
  { name: 'Tomato', hex: '#FF6347' },
  { name: 'Rose', hex: '#FF007F' },
  { name: 'Ruby', hex: '#E0115F' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Wine', hex: '#722F37' },
  { name: 'Vermilion', hex: '#E34234' },
  { name: 'Cerise', hex: '#DE3163' },
  { name: 'Scarlet', hex: '#FF2400' },

  // Oranges
  { name: 'Orange Red', hex: '#FF4500' },
  { name: 'Dark Orange', hex: '#FF8C00' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Peach', hex: '#FFE5B4' },
  { name: 'Apricot', hex: '#FBCEB1' },
  { name: 'Amber', hex: '#FFBF00' },
  { name: 'Burnt Orange', hex: '#CC5500' },
  { name: 'Tangerine', hex: '#FF9966' },
  { name: 'Pumpkin', hex: '#FF7518' },
  { name: 'Persimmon', hex: '#EC5800' },
  { name: 'Sienna', hex: '#A0522D' },
  { name: 'Burnt Sienna', hex: '#A24936' },
  { name: 'Copper', hex: '#B87333' },
  { name: 'Bronze', hex: '#CD7F32' },
  { name: 'Rust', hex: '#B7410E' },
  { name: 'Terracotta', hex: '#E2725B' },

  // Yellows
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Khaki', hex: '#F0E68C' },
  { name: 'Dark Khaki', hex: '#BDB76B' },
  { name: 'Lemon', hex: '#FFF44F' },
  { name: 'Canary', hex: '#FFEF00' },
  { name: 'Mustard', hex: '#FFDB58' },
  { name: 'Honey', hex: '#EB9605' },
  { name: 'Saffron', hex: '#F4C430' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Ivory', hex: '#FFFFF0' },
  { name: 'Champagne', hex: '#F7E7CE' },
  { name: 'Wheat', hex: '#F5DEB3' },
  { name: 'Buff', hex: '#F0DC82' },
  { name: 'Jonquil', hex: '#FADA5E' },

  // Greens
  { name: 'Green', hex: '#008000' },
  { name: 'Dark Green', hex: '#006400' },
  { name: 'Lime', hex: '#00FF00' },
  { name: 'Lime Green', hex: '#32CD32' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'Sea Green', hex: '#2E8B57' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Dark Olive Green', hex: '#556B2F' },
  { name: 'Sage', hex: '#BCB88A' },
  { name: 'Mint', hex: '#98FF98' },
  { name: 'Emerald', hex: '#50C878' },
  { name: 'Jade', hex: '#00A86B' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Dark Teal', hex: '#006D6F' },
  { name: 'Aquamarine', hex: '#7FFFD4' },
  { name: 'Chartreuse', hex: '#7FFF00' },
  { name: 'Pistachio', hex: '#93C572' },
  { name: 'Moss Green', hex: '#8A9A5B' },
  { name: 'Olive Drab', hex: '#6B8E23' },
  { name: 'Spring Green', hex: '#00FF7F' },

  // Blues
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Dark Blue', hex: '#00008B' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Midnight Blue', hex: '#191970' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Cobalt', hex: '#0047AB' },
  { name: 'Azure', hex: '#007FFF' },
  { name: 'Sapphire', hex: '#0F52BA' },
  { name: 'Cerulean', hex: '#007BA7' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Light Sky Blue', hex: '#87CEFA' },
  { name: 'Steel Blue', hex: '#4682B4' },
  { name: 'Powder Blue', hex: '#B0E0E6' },
  { name: 'Baby Blue', hex: '#89CFF0' },
  { name: 'Cornflower Blue', hex: '#6495ED' },
  { name: 'Denim', hex: '#1560BD' },
  { name: 'Periwinkle', hex: '#CCCCFF' },
  { name: 'Ice Blue', hex: '#99E6FF' },

  // Purples
  { name: 'Indigo', hex: '#4B0082' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Dark Purple', hex: '#301934' },
  { name: 'Violet', hex: '#EE82EE' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Plum', hex: '#DDA0DD' },
  { name: 'Orchid', hex: '#DA70D6' },
  { name: 'Mauve', hex: '#E0B0FF' },
  { name: 'Amethyst', hex: '#9966CC' },
  { name: 'Lilac', hex: '#C8A2C8' },
  { name: 'Wisteria', hex: '#C9A0DC' },
  { name: 'Iris', hex: '#5A4FCF' },
  { name: 'Lilac', hex: '#B57EDC' },
  { name: 'Grape', hex: '#6F2DA8' },
  { name: 'Mulberry', hex: '#C54B8C' },
  { name: 'Heliotrope', hex: '#DF73FF' },

  // Pinks
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Hot Pink', hex: '#FF69B4' },
  { name: 'Deep Pink', hex: '#FF1493' },
  { name: 'Fuchsia', hex: '#FF00FF' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Carnation', hex: '#FFA6C9' },
  { name: 'Blush', hex: '#DE5D83' },
  { name: 'Flamingo', hex: '#FC8EAC' },
  { name: 'Flamingo Pink', hex: '#FC8EAC' },
  { name: 'Rose Quartz', hex: '#AA98A9' },
  { name: 'Ballet Pink', hex: '#F5C2C7' },
  { name: 'Shell Pink', hex: '#FFB4C2' },

  // Browns
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Chocolate', hex: '#D2691E' },
  { name: 'Saddle Brown', hex: '#8B4513' },
  { name: 'Peru', hex: '#CD853F' },
  { name: 'Sandy Brown', hex: '#F4A460' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'Khaki', hex: '#C3B091' },
  { name: 'Taupe', hex: '#483C32' },
  { name: 'Espresso', hex: '#3C1414' },
  { name: 'Mahogany', hex: '#C04000' },
  { name: 'Chestnut', hex: '#954535' },
  { name: 'Walnut', hex: '#773F1A' },
  { name: 'Cocoa', hex: '#D2691E' },
  { name: 'Caramel', hex: '#FFD59A' },
  { name: 'Beige', hex: '#F5F5DC' },

  // Neutrals
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Snow', hex: '#FFFAFA' },
  { name: 'Ghost White', hex: '#F8F8FF' },
  { name: 'White Smoke', hex: '#F5F5F5' },
  { name: 'Platinum', hex: '#E5E4E2' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Light Gray', hex: '#D3D3D3' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Dim Gray', hex: '#696969' },
  { name: 'Dark Gray', hex: '#A9A9A9' },
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Gunmetal', hex: '#2C3539' },
  { name: 'Onyx', hex: '#353839' },
  { name: 'Jet Black', hex: '#0A0A0A' },
  { name: 'Black', hex: '#000000' },
  { name: 'Obsidian', hex: '#1B1B1B' },
  { name: 'Graphite', hex: '#383838' },
  { name: 'Ash', hex: '#B2BEB5' },
]

// Convert hex to distance in RGB space
function hexDistance(hex1, hex2) {
  const h1 = hex1.replace('#', '')
  const h2 = hex2.replace('#', '')
  const r1 = parseInt(h1.substring(0, 2), 16)
  const g1 = parseInt(h1.substring(2, 4), 16)
  const b1 = parseInt(h1.substring(4, 6), 16)
  const r2 = parseInt(h2.substring(0, 2), 16)
  const g2 = parseInt(h2.substring(2, 4), 16)
  const b2 = parseInt(h2.substring(4, 6), 16)
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
}

export function getColorName(hex) {
  const upper = hex.toUpperCase()
  // Exact match
  const exact = COLOR_NAMES.find(c => c.hex === upper)
  if (exact) return exact.name
  // Closest match
  let closest = COLOR_NAMES[0]
  let minDist = Infinity
  for (const named of COLOR_NAMES) {
    const dist = hexDistance(upper, named.hex)
    if (dist < minDist) {
      minDist = dist
      closest = named
    }
  }
  return closest.name
}

export function getClosestColorName(hex) {
  const upper = hex.toUpperCase()
  const exact = COLOR_NAMES.find(c => c.hex === upper)
  if (exact) return { name: exact.name, distance: 0, isExactMatch: true }
  let closest = COLOR_NAMES[0]
  let minDist = Infinity
  for (const named of COLOR_NAMES) {
    const dist = hexDistance(upper, named.hex)
    if (dist < minDist) {
      minDist = dist
      closest = named
    }
  }
  return { name: closest.name, distance: Math.round(minDist), isExactMatch: false }
}

export function getSimilarityDescription(distance) {
  if (distance === 0) return 'Exact match'
  if (distance < 15) return 'Very close'
  if (distance < 30) return 'Close'
  if (distance < 60) return 'Similar'
  return 'Approximate'
}
