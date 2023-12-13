import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'amount'
})
export class AmountPipe implements PipeTransform {

    transform(value: number): string {
        const options = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };
        return Number(value).toLocaleString('en', options);
    }
}
