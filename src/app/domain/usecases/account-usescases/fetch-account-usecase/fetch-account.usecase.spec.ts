import {FetchAccountUseCase} from "./fetch-account.usecase";
import {IAccountRepository} from "../../../repositories/iaccount.repository";
import {AccountEntity} from "../../../entities";
import {MOCK_ACCOUNTS} from "../../../../data/datasources/remote/firebase/account/account.repository.spec";

describe('FetchAccountUseCase', () => {

    let usecase: FetchAccountUseCase;
    let iaccountRepository: jasmine.SpyObj<IAccountRepository>;
    let account: AccountEntity;

    beforeEach(() => {
        iaccountRepository = jasmine.createSpyObj(IAccountRepository, ['fetch']);
        usecase = new FetchAccountUseCase(iaccountRepository);
        account = MOCK_ACCOUNTS[0];
    });

    describe('constructor', () => {
        it('should be created', () => {
            expect(usecase).toBeTruthy();
        });
        it('should accept IAccountRepository as dependency', () => {
            expect(usecase['accountRepository']).toBeTruthy();
        });

    })

});
