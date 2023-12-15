import {Component, Input, OnInit} from '@angular/core';
import {AmountHelper} from "../../../helpers/amount.helper";

@Component({
    selector: 'app-amount',
    templateUrl: './amount.component.html',
    styleUrls: ['./amount.component.css']
})
export class AmountComponent implements OnInit {
    @Input() amount!: string;

    amountCurrency!: string;
    amountPeriod!: string;
    amountValue!: string;

    constructor() {
    }

    ngOnInit(): void {
        this.amountCurrency = AmountHelper.getAmountCurrency(this.amount);
        this.amountPeriod = AmountHelper.getAmountPeriod(this.amount);
        this.amountValue = AmountHelper.getAmount(this.amount);
    }

    getFirstChar(s: string): string {
        return Array.from(s)[0];
    }

    protected readonly AmountHelper = AmountHelper;
}
