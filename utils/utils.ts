export function formatGameTitle(title: string): string {
 
    if (title && title.includes('-')) {
      const words = title.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1));
  
      return words.join(' ');
    }
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  
export function formatDescription(input: string): string {
    return input.replace(/#/g, '');
  }
 