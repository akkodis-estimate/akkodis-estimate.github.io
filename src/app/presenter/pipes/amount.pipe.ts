import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'amount'
})
export class AmountPipe implements PipeTransform {

    transform(value?: number, ...args: any[]): string {
        
        let decimalDigits = args && args.length > 0 && Number.isFinite(args[0]) && args[0] > 0 ? args[0] : 0;

        if (Number.isFinite(value)) {
            const options = {
                minimumFractionDigits: decimalDigits,
                maximumFractionDigits: decimalDigits
            };
            value = value ? value : 0;
            return Number(value).toLocaleString('en', options);
        } else {
            return "Unable to convert!";
        }
    }
}
