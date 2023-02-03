# Apresentando TerezzuJs

TerezzuJs é uma micro-biblioteca de padrões reativos para construção de componentes javascript.

A idéia por trás de Terezzu é utilizar padrões simples, eficazes e amplamente conhecidos na construção
de interfaces de aplicações modernas.

## Instalação

``` npm i terezzu ```

## Estrutura de componentes

TerezzuJs permite criar componentes reativos que se mantém completamente desacoplados mesmo trabalhando
constantemente em conjunto para formar interfaces complexas.

Os componentes são definidos através do padrão MVC e as reações de alteração de estados são geridas
através de stores de observadores.

### VIEW

No TerezzuJs a view é exatamente o que representa o V do padrão MVC.

É na view que definimos a estrutura HTML dos componentes e os eventos de interação.

```js
export const view = ({ html, css, controller }) => {
  const template = ({ state }) => html`
    <h1 onClick=${controller.logger}>Hello TerezzuJs!</h1>
  `

  const styles = () => css`
    h1 {
      color: red;
    }
  `

  return { template, styles }
}
```

> Os parametros HTML e CSS são funções tag capazes de criar elementos HTML e aplicar CSS, além de ajudar no hightlight do código escrito.

Além das funções HTML e CSS recebidas, ainda é possível notar o acesso ao controllador do componente como parâmetro.

Os métodos no controller podem acionados por um listener ao disparam um evendo DOM como no exemplo de demonstração.

Dentro da função template o state é recebido como parâmetro e pode ser utilizado como variável somente leitura para acessar propriedades de dados.

### MODEL

O módel é apenas uma factory function que prove acesso a store observável do componente.

```js
export const model = (state) => {
  state.merge({
    title: 'Estádo inicial'
  })

  const getState = () => state.get()

  const setState = (payload) => state.set({ ...payload })

  return {
    getState,
    setState
  }
}
```

### Controller

O controller faz a ponte a view e o módel á que no padrão MVC a view não conhece o módel e apesar de em Terezzu, a view ter acesso ao state da aplicação como somente leitura, o estado não pode ser alterado diretamente, apenas através do intermédio do controller.

```js
export const controller = ({ model, hooks, eventDrive }) => {
  hooks.beforeOnInit(() => dispatch('onLoad', { loaded: true }))

  const dispatch = (eventName, payload) => eventDrive.emit(eventName, payload)

  const setTitle = ({ title }) => model.setState({ title })

  const getUppercaseTitle = () => {
    const { title } = model.getState()
    return title.toUpperCase()
  }
}
```

> model, hooks e eventDrive são objetos que fornecem recursos ao controlador para facilitar a administração do estado da aplicação.

### Model, Hooks e eventDrive

- Através do objeto módel é possível inscrever-se para notar mudanças no estado.
- Por meios dos hooks é possível detectar eventos do ciclo de vida do componente e executar métodos específicos para cada trecho do ciclo de vida do componente.
- Através do eventDrive é possível trocar informações com outros componentes através de eventos pubsub.

### A peça completa

Depois de definir cada uma das partes do componente (model, view e controller) é preciso juntar tudo para formar a estrutura do componente.

```js
import { model } from './model'
import { view } from './view'
import { controller } from './controller'

export const appHello = (state) => ({
  state,
  model,
  view,
  controller
})
```

Como observou, basta importar as dependências do componente e exportar uma função que identifica o componente em construção.

A função do componente deve retornar model, view e controller e a propriedade adicional state fornecida por TerezzuJs para facilitar na hora de criar um estado observável.

### Renderizando componentes

Para renderizar um componente, certifique-se de importar o render do TerezzuJs e os componentes a serem renderizados

```js
import { render } from 'Terezzu'
import { appMain } from './components/main/index.js'
import { appHello } from './components/hello/index.js'

render(appMain, 'main', (appMainElement) => {
  render(appHeader, 'header', null, appMainElement)
})
```

A função render recebe os seguintes parametros em ordem:

1. O componente a ser renderizado.
2. O seletor css do componente.
3. Uma função que permite rederizar outros componentes.
4. O elemento host do componente pai

Os dois parâmetros do render são muitos simples e por isso não necessitam de maiores explicações. No entanto, os dois últimos parâmetros podem ser melhor explorados.

```js
  render (component, selector, callback, contextElement) {
    const context = contextElement || Document.body
    const elements = context.querySelectorAll(selector)
    const components = createComponent(Array.from(elements))
    reactor(components, (component) => component.render())
  }
```

Acima, um código que se parece com a estrutura do método render que injeta um componente e inicializa suas propriedades reativas.

Observe os dois últimos parâmetros (callback, contextElement).

- Callback - É uma função que deve ser executada após o componente ser renderizado.
- ContextElement - É o contexto onde o componente será relacionado a um element host.

### Propriedades de dados

Os compoentes podem carregar propriedades dinâmicamente através do HTML.

```js
const menuList = () => ['Home', 'Contato', 'Blog']

const template = () => html` <AppMenu data-list=${menuList} /> `
```

No exemplo acima, uma lista está sendo injetada no componente AppMenu através do dataset "data-list".

```js
const view = ({ html, controller }) => {
  const menuItems = controller.getMenuItems()

  const template = () => html`
    <ul>
      ${menuItems.map((item) => html` <li>${item}</li>`)}
    </ul>
  `

  return { template }
}
```

No trecho acima, o controller recupera do dataset contendo a lista do menu e a retorna através do método getMenuItems. Então, a variável menuItems pode ser iterada e a lista do menu exibida.

```js
const controller = ({ model, props }) => {
  const getMenuItems = () => {
    return JSON.parse(props.list)
  }

  return { getMenuItem }
}
```

O controller do componente se parece com o trecho de código acima.

Observe que foi necessário fazer uso de JSON.parse para converter o dataset em um objeto javascript.

### Hooks e eventos

Os hooks e eventos podem ser usados para observar o ciclo de vida do componente e reagir a ele, permitindo a comunicação e o gerenciamento do estado da aplicação.

```js
export const controller = ({ model, hooks, eventDrive }) => {
  hooks.beforeOnInit(() => dispatch('onLoad', { loaded: true }))

  const dispatch = (eventName, payload) => eventDrive.emit(eventName, payload)

  const setTitle = ({ title }) => model.setState({ title })

  const getUppercaseTitle = () => {
    const { title } = model.getState()
    return title.toUpperCase()
  }
}
```

Os hooks podem ser usados para reagir aos eventos do ciclo de vida do componente sempre que necessário.

- beforeOnInit - Pode executar observadores antes de iniciar o componente
- afterOnInit - Pode executar observadores após de iniciar o componente
- beforeOnRender - Pode executar observadores antes de renderizar o componente
- afterOnRender - Pode executar observadores depois de renderizar o componente

_Ex:_

```js
export const controller = ({ hooks }) => {
  hooks.beforeOnInit(() => dispatch('onLoad', { loaded: true }))
  const dispatch = (eventName, payload) => eventDrive.emit(eventName, payload)
}
```

Os hooks recebem um callback como parâmetro, e esse callback pode rexecutar qualquer quantidade de interessados.

o Objeto eventDrive disponibiliza os métodos on, emit, off para inscrever-se para um evento, emitir um evento e deixar de observar um evento.

Para emitir um evento é necessário observar que, o primeiro parâmetro do método emit é o nome do evento e o segundo um objeto contendo o valor a ser transmitido através do evento disparado.

### Conclusão

Pronto, esse é o básico que você precisa para criar aplicações com TerezzuJs, mas, também é tudo.
