interface JerseyForSku {
  team_name: string;
  season: string;
  type: string;
}

const teamCodes: { [key: string]: string } = {
  'Real Madrid': 'RM',
  'Barcelona': 'BR',
  'AC Milan': 'AC',
  'Man City': 'MC',
  'Man Utd': 'MU',
  'Spurs': 'SPS',
  'Inter Milan': 'INT',
  'Arsenal': 'AR',
  'Liverpool': 'LV',
  'Chelsea': 'CL',
  'PSG': 'PSG',
  'Argentina': 'AF',
  'Brazil': 'BZ',
  'Germany': 'GR',
  'Dortmund': 'DV',
  'Bayern Munich': 'BM',
};

const kitTypeCodes: { [key: string]: string } = {
  'Home': 'H',
  'Away': 'A',
  'Third': '3',
  'Training': 'T',
  'Retro': 'R', // Assuming Retro maps to R, not specified
};

const sleeveCodes: { [key: string]: string } = {
  'H': 'H', // Half sleeve
  'F': 'F', // Full sleeve
};

const sizeCodes: { [key: string]: string } = {
  'XS': 'XS', // Not specified, keeping as is
  'S': 'S',   // Not specified, keeping as is
  'M': '1',
  'L': '2',
  'XL': '3',
  'XXL': '4',
  'XXXL': '5',
};

function getTeamCode(name: string): string {
  if (teamCodes[name]) {
    return teamCodes[name];
  }
  // Fallback for unlisted teams
  const existingCodes = new Set(Object.values(teamCodes));
  let code = name.substring(0, 2).toUpperCase();
  if (existingCodes.has(code)) {
    code = name.substring(0, 3).toUpperCase();
  }
  return code;
}

function getSeasonCode(season: string): string {
  const match = season.match(/(\d{2})$/);
  if (match) {
    return match[1];
  }
  const yearMatch = season.match(/\d{4}/);
  if (yearMatch) {
    return yearMatch[0].substring(2);
  }
  return 'XX'; // Fallback
}

function getKitCode(type: string): string {
  return kitTypeCodes[type] || type.substring(0, 1).toUpperCase();
}

function getSleeveCode(sleeve: string): string {
  return sleeveCodes[sleeve] || 'X';
}

function getSizeCode(size: string): string {
  return sizeCodes[size] || size;
}

export function generateSku(jersey: JerseyForSku, size: string, sleeve: string): string {
  const teamPart = getTeamCode(jersey.team_name);
  const seasonPart = getSeasonCode(jersey.season);
  const kitPart = getKitCode(jersey.type);
  const sleevePart = getSleeveCode(sleeve);
  const sizePart = getSizeCode(size);

  return `${teamPart}${seasonPart}${kitPart}${sleevePart}${sizePart}`;
}
