import './scss/styles.scss';
// Используем паттерн Dependency Injection для более гибкого кода
// Используем паттерн Controller для корневого класса - чтобы управлять всем приложением из одного класса

/**
 * Это класс в отдельном файле
 */
// class ComponentC {
//     constructor(componentA, componentB, serviceA) {
//         this.componentA = componentA;
//         this.componentB = componentB;
//         this.serviceA = serviceA;
//     }
// }

/**
 * Этот класс в отдельном файле
 */
class AppController {
    // apiService = new Api();
    // eventEmitter = new EventEmitter();
    // componentA = new ComponentA();
    // componentB = new ComponentB();
    // serviceA = new ServiceA(this.apiService, this.eventEmitter);
    // componentC = new ComponentC(this.componentA, this.componentB, this.serviceA);

    constructor() {
        this._loadAndRenderPosts();
    }

    private _loadAndRenderPosts(): void {}
}

const app = new AppController();
