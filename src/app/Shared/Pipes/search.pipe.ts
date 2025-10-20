import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {
  transform(groups: any[] = [], word: string = ''): any[] {
    if (!word.trim()) return groups; 
    return groups.filter((item) =>
      item.title?.toLowerCase().includes(word.toLowerCase())
    );
  }
}
