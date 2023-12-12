import {AccountEntity} from "../../../../../domain/entities";
import {RoleEnum} from "../../../../../core/enums/RoleEnum";
import {AccountRepository} from "./account.repository";
import {AngularFirestore} from "@angular/fire/compat/firestore";

export const MOCK_ACCOUNTS: AccountEntity[] = [
    {
        "id": "8f9bc8cf-e9fd-4977-944d-2d8311e73d8d",
        "createdAt": new Date(),
        "updatedAt": new Date(),
        "deleted": false,
        "firstname": "Absa",
        "lastname": "ADMIN",
        "email": "absa.admin@here.now",
        "password": "",
        "phoneNumber": "+971 23 564 7891",
        "address": "Dubai",
        "role": RoleEnum.Admin,
        "avatar": ""
    },
    {
        "id": "7dd63784-9cd5-4e98-85f2-cc2a9d11d219",
        "createdAt": new Date(),
        "updatedAt": new Date(),
        "deleted": false,
        "firstname": "Absa",
        "lastname": "BUSINESS",
        "email": "absa.business@here.now",
        "password": "",
        "phoneNumber": "+971 23 564 7892",
        "address": "Dubai",
        "role": RoleEnum.Business,
        "avatar": ""
    },
    {
        "id": "1d2b72e8-a7f2-44fe-bdc0-974dbdebc2a1",
        "createdAt": new Date(),
        "updatedAt": new Date(),
        "deleted": false,
        "firstname": "Absa",
        "lastname": "FINANCIAL",
        "email": "absa.financial@here.now",
        "password": "",
        "phoneNumber": "+971 23 564 7893",
        "address": "Dubai",
        "role": RoleEnum.Financial,
        "avatar": ""
    }
];

describe('AccountRepository', () => {

    let repository: AccountRepository;
    let firestore: jasmine.SpyObj<AngularFirestore>;

    beforeEach(() => {
        firestore = jasmine.createSpyObj('AngularFirestore', ['get', 'post', 'put', 'delete']);
        repository = new AccountRepository(firestore);
    });

    describe('accountRepository', () => {
        it('should be created', () => {
            expect(repository).toBeTruthy();
        })

        it('should be an instance of IAccountRepository', () => {
            expect(repository instanceof AccountRepository).toBeTruthy();
            expect(repository instanceof AccountRepository).toBeTruthy();
        })

    });

});
