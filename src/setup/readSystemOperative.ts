
function getOperatingSystem(): 'linux' | 'windows' | 'mac' | 'unknown' {
  const platform = process.platform;
  
  if (platform === 'linux') return 'linux';
  if (platform === 'win32') return 'windows';
  if (platform === 'darwin') return 'mac';
  
  return 'unknown';
}

export { getOperatingSystem };