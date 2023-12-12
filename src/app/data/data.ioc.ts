import {Provider} from "@angular/core";
import {IAccountInteractor} from "./interactors/contracts/iaccount.interactor";
import {AccountInteractor} from "./interactors/implementations/account.interactor";
import {AccountRepository} from "./datasources/remote/firebase/account/account.repository";
import {FetchAccountUseCase} from "../domain/usecases/account-usescases/fetch-account-usecase/fetch-account.usecase";
import {LoginAccountUseCase} from "../domain/usecases/account-usescases/login-account-usecase/login-account.usecase";
import {CreateAccountUseCase} from "../domain/usecases/account-usescases/create-account-usecase/create-account.usecase";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {IClientInteractor} from "./interactors/contracts/iclient.interactor";
import {ClientInteractor} from "./interactors/implementations/client.interactor";
import {ClientRepository} from "./datasources/remote/firebase/client/client.repository";
import {CreateClientUseCase} from "../domain/usecases/client-usescases/create-client-usecase/create-client.usecase";
import {FetchClientsUseCase} from "../domain/usecases/client-usescases/fetch-clients-usecase/fetch-clients.usecase";
import {IProjectInteractor} from "./interactors/contracts/iproject.interactor";
import {ProjectInteractor} from "./interactors/implementations/project.interactor";
import {ProjectRepository} from "./datasources/remote/firebase/project/project.repository";
import {CreateProjectUseCase} from "../domain/usecases/project-usecases/create-project-usecase/create-project.usecase";
import {FetchProjectsUseCase} from "../domain/usecases/project-usecases/fetch-projects-usecase/fetch-projects.usecase";
import {IResourceInteractor} from "./interactors/contracts/iresource.interactor";
import {ResourceInteractor} from "./interactors/implementations/resource.interactor";
import {ResourceRepository} from "./datasources/remote/firebase/resource/resource.repository";
import {
    CreateResourceUseCase
} from "../domain/usecases/resource-usecases/create-resource-usecase/create-resource.usecase";
import {
    FetchResourcesUseCase
} from "../domain/usecases/resource-usecases/fetch-resources-usecase/fetch-resources.usecase";
import {IWorkingDaysInteractor} from "./interactors/contracts/iworking-days.interactor";
import {WorkingDaysInteractor} from "./interactors/implementations/working-days.interactor";
import {WorkingDaysRepository} from "./datasources/remote/firebase/working-days/working-days.repository";
import {
    FetchWorkingDaysUseCase
} from "../domain/usecases/working-days-usescases/fetch-working-days-usecase/fetch-working-days.usecase";
import {FetchAccountsUseCase} from "../domain/usecases/account-usescases/fetch-accounts-usecase/fetch-accounts.usecase";
import {ICurrencyExchangeInteractor} from "./interactors/contracts/icurrency-exchange.interactor";
import {CurrencyExchangeInteractor} from "./interactors/implementations/currency-exchange.interactor";
import {CurrencyExchangeRepository} from "./datasources/remote/firebase/currency-exchange/currency-exchange.repository";
import {
    FetchCurrencyExchangesUseCase
} from "../domain/usecases/currency-exchange-usecases/fetch-currency-exchanges-usecase/fetch-currency-exchanges.usecase";
import {
    CreateCurrencyExchangeUseCase
} from "../domain/usecases/currency-exchange-usecases/create-currency-exchange-usecase/create-currency-exchange.usecase";
import {
    FetchProjectResourcesUseCase
} from "../domain/usecases/resource-usecases/fetch-project-resources.usecase/fetch-project-resources.usecase";

export const DATA_ACCOUNT_IOC: Provider[] = [
    {
        provide: IAccountInteractor,
        useClass: AccountInteractor
    },
    {
        deps: [AngularFirestore],
        provide: AccountRepository,
        useFactory: (firestore: AngularFirestore) => new AccountRepository(firestore)
    },
    {
        deps: [AccountRepository],
        provide: FetchAccountUseCase,
        useFactory: (repository: AccountRepository) => new FetchAccountUseCase(repository),
    },
    {
        deps: [AccountRepository],
        provide: LoginAccountUseCase,
        useFactory: (repository: AccountRepository) => new LoginAccountUseCase(repository),
    },
    {
        deps: [AccountRepository],
        provide: CreateAccountUseCase,
        useFactory: (repository: AccountRepository) => new CreateAccountUseCase(repository),
    },
    {
        deps: [AccountRepository],
        provide: FetchAccountsUseCase,
        useFactory: (repository: AccountRepository) => new FetchAccountsUseCase(repository),
    },
];

export const DATA_CLIENT_IOC: Provider[] = [
    {
        provide: IClientInteractor,
        useClass: ClientInteractor
    },
    {
        deps: [AngularFirestore],
        provide: ClientRepository,
        useFactory: (firestore: AngularFirestore) => new ClientRepository(firestore)
    },
    {
        deps: [ClientRepository],
        provide: CreateClientUseCase,
        useFactory: (repository: ClientRepository) => new CreateClientUseCase(repository),
    },
    {
        deps: [ClientRepository],
        provide: FetchClientsUseCase,
        useFactory: (repository: ClientRepository) => new FetchClientsUseCase(repository),
    }
];

export const DATA_PROJECT_IOC: Provider[] = [
    {
        provide: IProjectInteractor,
        useClass: ProjectInteractor
    },
    {
        deps: [AngularFirestore],
        provide: ProjectRepository,
        useFactory: (firestore: AngularFirestore) => new ProjectRepository(firestore)
    },
    {
        deps: [ProjectRepository],
        provide: CreateProjectUseCase,
        useFactory: (repository: ProjectRepository) => new CreateProjectUseCase(repository),
    },
    {
        deps: [ProjectRepository],
        provide: FetchProjectsUseCase,
        useFactory: (repository: ProjectRepository) => new FetchProjectsUseCase(repository),
    }
];

export const DATA_RESOURCE_IOC: Provider[] = [
    {
        provide: IResourceInteractor,
        useClass: ResourceInteractor
    },
    {
        deps: [AngularFirestore],
        provide: ResourceRepository,
        useFactory: (firestore: AngularFirestore) => new ResourceRepository(firestore)
    },
    {
        deps: [ResourceRepository],
        provide: CreateResourceUseCase,
        useFactory: (repository: ResourceRepository) => new CreateResourceUseCase(repository),
    },
    {
        deps: [ResourceRepository],
        provide: FetchResourcesUseCase,
        useFactory: (repository: ResourceRepository) => new FetchResourcesUseCase(repository),
    },
    {
        deps: [ResourceRepository],
        provide: FetchProjectResourcesUseCase,
        useFactory: (repository: ResourceRepository) => new FetchProjectResourcesUseCase(repository),
    }
];

export const DATA_WORKING_DAYS_IOC: Provider[] = [
    {
        provide: IWorkingDaysInteractor,
        useClass: WorkingDaysInteractor
    },
    {
        deps: [AngularFirestore],
        provide: WorkingDaysRepository,
        useFactory: (firestore: AngularFirestore) => new WorkingDaysRepository(firestore)
    },
    {
        deps: [WorkingDaysRepository],
        provide: FetchWorkingDaysUseCase,
        useFactory: (repository: WorkingDaysRepository) => new FetchWorkingDaysUseCase(repository),
    }
];

export const DATA_CURRENCY_EXCHANGE_IOC: Provider[] = [
    {
        provide: ICurrencyExchangeInteractor,
        useClass: CurrencyExchangeInteractor
    },
    {
        deps: [AngularFirestore],
        provide: CurrencyExchangeRepository,
        useFactory: (firestore: AngularFirestore) => new CurrencyExchangeRepository(firestore)
    },
    {
        deps: [CurrencyExchangeRepository],
        provide: FetchCurrencyExchangesUseCase,
        useFactory: (repository: CurrencyExchangeRepository) => new FetchCurrencyExchangesUseCase(repository),
    },
    {
        deps: [CurrencyExchangeRepository],
        provide: CreateCurrencyExchangeUseCase,
        useFactory: (repository: CurrencyExchangeRepository) => new CreateCurrencyExchangeUseCase(repository),
    }
];
