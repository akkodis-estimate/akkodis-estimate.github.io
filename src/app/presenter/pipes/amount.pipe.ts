import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'amount'
})
export class AmountPipe implements PipeTransform {

    transform(value?: number): string {
        if (Number.isFinite(value)) {
            const options = {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            };
            value = value ? value : 0;
            return Number(value).toLocaleString('en', options);
        } else {
            return "Unable to convert!";
        }
    }
}
