# Zolak API заметки

## Обсуждение:

1. Initialize \- инициализация Configurator с определенными параметрами (? токен, язык опционально, для Showroom \- фильтры) \+ тип встраивания  
2. Close \- закрытие Configurator (возможно актуально только для режима popup)  
3. Shopping cart:  
   1. Put to shopping cart  
   2. Delete from shopping cart  
   3. List (cartIds?)  
4. Set Product via SKU (material sku? parts?)  
5. Which interior? (дать знать какой интерьер сейчас открыт)  
6. Favorites (добавление, удаление)

Типы встраивания:

1. Popup (для Configurator/Showroom)  
2. Embedded (для Configurator/Showroom)

Вопросы:

1. Минимальные размеры окон?  
2. Мобильная версия?  
3. Несколько инстансов (карта идентификаторов?)  
4. Iframe VS DIV? **Решение: iframe \+ ResizeObserver**

## Доступные внутренние методы

Методы, которые достали из текущего кода, не факт, что у всех есть реализация:  
export const ClientAPIEvent \= {  
  Get: {  
    Price: 'zolak:get:price',  
    Description: 'zolak:get:description',  
    ProductsInfo: 'zolak:get:productsinfo',  
    ProductInfo: 'zolak:get:productinfo',  
  },  
  Put: {  
    ShoppingCart: 'zolak:put:shoppingcart',  
    Favorites: 'zolak:put:favorites',  
    Interior: 'zolak:put:interior',  
  },  
  Update: {  
    Load: 'zolak:update:load',  
    Model: 'zolak:update:model',  
    Light: 'zolak:update:light',  
    Data: 'zolak:update:data',  
    Mode: 'zolak:update:mode',  
    DisableControls: 'zolak:update:disable\_controls',  
    CanvasRef: 'zolak:update:canvas\_ref',  
    IsFloor: 'zolak:update:isFloor',  
    ActiveModel: 'zolak:update:activeModel',  
    Object: 'zolak:update:object',  
    Close: 'zolak:update:close',  
    UserSession: 'zolak:update:usersession',  
  },  
  Delete: {  
    Model: 'zolak:delete:model',  
    ShoppingCart: 'zolak:delete:shoppingcart',  
  },  
  Hide: {  
    Model: 'zolak:hide:model',  
  },  
  Copy: {  
    Model: 'zolak:copy:model',  
  },  
};

## Модификации для встраивания embedded

Необходимо реализовать возможность встраивания компонентов Zolak напрямую в сайт клиента не в режиме popup.

Configurator:

1. Убираем затемнение, которое появляется в popup версии  
2. Убираем бордеры и скругления  
3. Убираем крестик закрытия (при этом иконку меню для Change texture quality и Light settings переносим на место крестика в самый угол)  
4. Опционально: Проверяем возможность избавления от нескольких loading или их объединения.  
   Сейчас есть несколько загрузок во время запуска:  
   1. Loading на сером экране (судя по всему грузится левая панель)  
   2. Loading кружочком (похоже на подгрузку модели)  
   3. Loading полоской над самой сценой (возможно применение текстуры)

Showroom:

1. Убираем Back to website (и в мобильной версии тоже)  
2. Поправить проблему с модалкой для превью материалов при не полноэкранном режиме.

Общее:  
Предоставить минимальные допустимые размеры области для встраивания для Configurator (с левой панелью и без) и Showroom.

# API Doc

## Showroom API

### Интеграция

#### Автоматическая

\<script  
src=”[http://cdn.zolak.tech/scripts/embed.js](http://cdn.zolak.tech/scripts/embed.js)”  
data-token=”‘\<token\>”  
data-language=”en” // optional  
data-container=”\#container” // querySelector  
data-modal=”true” // optional  
data-interface=”showroom”  
data-view=”interiors” // optional  
data-filters=JSON.stringify(\[\]) // optional  
\>\</script\>

#### Ручная (Пример)

Где-то в шаблоне cms вставляем  
\<script src=”[http://cdn.zolak.tech/scripts/embed.js](http://cdn.zolak.tech/scripts/embed.js)”\>\</script\>

На странице где хотим использовать  
\<script\>  
window.ZolakAPI.initShowroom(‘\<token\>’, {  
  language: ‘en’,  
  container: ‘.container’,  
});

window.ZolakShowroom.onReady('.container', async (*app*) *\=\>* {  
  await app.Cart.add(‘SKU-123’); // materialMap??  
});

\</script\>

### Методы API

#### InitShowroom(token, options) \- Инициализация приложения

window.ZolakAPI.initShowroom(‘\<token\>’, {  
container: ‘.container’,  
});

| Props | Type | Default | Description |
| :---- | :---- | :---- | :---- |
| token | string |  | Токен приложения, выданный разработчиком приложения |
| options | object |  | Дополнительные параметры приложения |
| options.language | string | en | Язык приложения, по-умолчанию en |
| options.container | string |  | Элемент DOM-модели в который будет встроено приложение.  Принимает DOMString, содержащий один селектор для сопоставления. |
| options.modal | boolean | false | Указывает каким образом необходимо отобразить приложение, в модальном окне или нет |
| options.filters | array | \[\] |  |
| options.view | ‘Interiors’ | ‘product’ | Interiors |  |

| Events | Description |
| :---- | :---- |
| onInitialized | Выполняется после инициализации приложения |

#### Destroy() \- закрыть приложение

window.ZolakShowroom.onReady('.container', async (*app*) *\=\>* {  
  await app.App.destroy();  
});

| Events | Description |
| :---- | :---- |
| onDestroy | Выполняется, по закрытии приложения |

#### Cart.add(productSKU) \- Добавить продукт в корзину

window.ZolakShowroom.onReady('.container', async (*app*) *\=\>* {  
  await app.Cart.add({ productId: \<productSKU\> });  
});

| Props | Type | Description |
| :---- | :---- | :---- |
| productSKU | string | SKU продукта |
| materialMap?? |  |  |

| Events | Description |
| :---- | :---- |
| onCartAdded | Выполняется после добавления в корзину |

#### Cart.remove(productSKU) \- Удалить продукт из корзины

window.ZolakShowroom.onReady('.container', async (*app*) *\=\>* {  
  await app.Cart.remove({ productId: \<productSKU\> });  
});

| Props | Type | Description |
| :---- | :---- | :---- |
| productSKU | string | SKU продукта |
| materialMap |  |  |

| Events | Description |
| :---- | :---- |
| onCartRemoved | Выполняется после удаления из корзины |

#### Cart.list() \- Получить список продуктов в корзине приложения

window.ZolakShowroom.onReady('.container', async (*app*) *\=\>* {  
  const productSKU: string\[\] \= await app.Cart.list();  
});

| Events | Description |
| :---- | :---- |
| onCartUpdated | Выполняется после изменения списка продуктов в корзине |

#### Interiors.item() \- Получить текущий интерьер

window.ZolakShowroom.onReady('.container', async (*app*) *\=\>* {  
  const item \= await app.Interiors.item();  
});

Параметры и события отсутствуют

####   

#### Favorites.add(productSKU) \- Добавить в список понравившихся продуктов

window.ZolakShowroom.onReady('.container', async (*app*) *\=\>* {  
  await app.Favorites.add({ productId: \<productSKU\> });  
});

| Props | Type | Description |
| :---- | :---- | :---- |
| productSKU | string | SKU продукта |
| materialMap |  |  |

| Events | Description |
| :---- | :---- |
| onFavoritesAdded | Выполняется после добавления в список фаворитов |

#### Favorites.remove(productSKU) \- Удалить из списка понравившихся продуктов

window.ZolakShowroom.onReady('.container', async (*app*) *\=\>* {  
  await app.Favorites.remove({ productId: \<productSKU\> });  
});

| Props | Type | Description |
| :---- | :---- | :---- |
| productSKU | string | SKU продукта |
| materialMap |  |  |

| Events | Description |
| :---- | :---- |
| onFavoritesRemoved | Выполняется после удаления из списка фаворитов |

#### Favorites.list() \- Получить список понравившихся продуктов

window.ZolakShowroom.onReady('.container', async (*app*) *\=\>* {  
  await app.Favorites.list();  
});

Параметры и события отсутствуют

## Configurator API

### Интеграция

#### Автоматическая

\<script  
src=”[http://cdn.zolak.tech/scripts/embed.js](http://cdn.zolak.tech/scripts/embed.js)”  
data-token=”‘\<token\>”  
data-language=”en” // optional  
data-container=”\#container” // querySelector  
data-modal=”true” // optional  
data-interface=”configurator”  
data-product=”\<productSKU\>”   
data-material-map=JSON.stringify({})  
data-sidebar=”true” // optional  
\>\</script\>

#### 

#### Ручная (Пример)

Где-то в шаблоне cms вставляем  
\<script src=”[http://cdn.zolak.tech/scripts/embed.js](http://cdn.zolak.tech/scripts/embed.js)”\>\</script\>

На странице где хотим использовать  
\<script\>  
	window.ZolakAPI.initConfigurator(‘\<token\>’, {  
language: ‘en’,  
container: ‘.container’,  
product: ‘\<productSKU\>’,   
materialMap: {  
	partName: sku,  
	partName: sku  
},  
modal: true, // optional  
sidebar: true, // optional  
});

	// Пример: По кнопке заказчика меняем продукт  
	\<button onclick=”window.ZolakConfigurator.getInstanceByContainer('\#container').Product.setSKU(‘\<productSKU\>’)materialMap??”\>Button text\</button\>

	// Отправляем запрос в приложение

window.ZolakConfigurator.onReady('.container', async (*app*) *\=\>* {  
  await app.Product.setSKU({ productId: \<productSKU\>});  
});

	// Получаем ответ из приложения на какие-либо действия (как узнать *instanceId)?*  
      // Пример подписки на все события от всех инстансов конфигуратора  
       window.ZolakConfigurator.on((*instanceId*, *eventName*, *payload*) *\=\>* {  
           console.debug(\`\[Global\] Event from ${*instanceId*}: ${*eventName*}\`, *payload*);  
       });

       // Пример подписки на все события конкретного инстанса используя '\*'  
       *const* instance2 \= window.ZolakConfigurator.getInstanceByContainer('\#app2');  
       if (instance2) {  
           instance2.on('\*', (*eventName*, *payload*) *\=\>* {  
               console.debug(\`\[Instance \#app2\] Event: ${*eventName*}\`, *payload*);  
           });  
       }

window.ZolakConfigurator.onReady('\#zolak-app-container', async (app) \=\> {  
app.on('onShow', (*payload*) *\=\>* {  
               console.debug(\`\[Instance \#app\] Event: \`, *payload*);  
});

window.ZolakConfigurator.onReady('\#zolak-app-container', async (app) \=\> {  
app.on('\*', (*eventName*, *payload*) *\=\>* {  
               console.debug(\`\[Instance \#app\] Event: ${*eventName*}\`, *payload*);  
});

\</script\>

### Методы API

#### InitConfigurator(token, options) \- Инициализация приложения

window.ZolakAPI.initConfigurator(‘\<token\>’, {  
container: ‘.container’,  
product: ‘\<productSKU\>’  
});

| Props | Type | Default | Description |
| :---- | :---- | :---- | :---- |
| token | string |  | Токен приложения, выданный разработчиком приложения |
| options | object |  | Дополнительные параметры приложения |
| options.language | string | en | Язык приложения, по-умолчанию en |
| options.container | string |  | Элемент DOM-модели в который будет встроено приложение.  Принимает DOMString, содержащий один селектор для сопоставления. |
| options.modal | boolean | false | Указывает каким образом необходимо отобразить приложение, в модальном окне или нет |
| options.product | string |  | SKU продукта для отображения |
| options.sidebar | boolean | true | Показать/Скрыть левую панель (Необходимо разрешение админа) |
| options.materialMap | string | null | Используемые материалы и части {part1: sku, part2: sku} |

| Events | Description |
| :---- | :---- |
| onInitialized | Выполняется после инициализации приложения |

#### 

#### APP

#### Destroy() \- закрыть приложение

window.ZolakConfigurator.onReady('.container', async (*app*) *\=\>* {  
  await app.App.destroy();  
});

| Events | Description |
| :---- | :---- |
| onDestroy | Выполняется, по закрытии приложения |

#### 

#### CART

#### Cart.add(productSKU) \- Добавить продукт в корзину

window.ZolakConfigurator.onReady('.container', async (*app*) *\=\>* {  
  await app.Cart.add({ productId: \<productSKU\>});  
});

| Props | Type | Description |
| :---- | :---- | :---- |
| productSKU | string | SKU продукта |
| materialMap |  |  |

| Events | Description |
| :---- | :---- |
| onCartAdded | Выполняется после добавления в корзину |

#### Cart.remove(productSKU) \- Удалить продукт из корзины

window.ZolakConfigurator.onReady('.container', async (*app*) *\=\>* {  
  await app.Cart.remove({ productId: \<productSKU\>});  
});

| Props | Type | Description |
| :---- | :---- | :---- |
| productSKU | string | SKU продукта |
| materialMap |  |  |

| Events | Description |
| :---- | :---- |
| onCartRemoved | Выполняется после удаления из корзины |

#### Cart.list() \- Получить список продуктов в корзине приложения

window.ZolakConfigurator.Cart.list();

| Events | Description |
| :---- | :---- |
| onCartUpdated | Выполняется после изменения списка продуктов в корзине |

#### Product

#### Product.setSKU(productSKU, materialMap) \- Отобразить продукт по SKU

window.ZolakConfigurator.onReady('.container', async (*app*) *\=\>* {  
  await app.Product.setSKU({ productId: \<productSKU\> });  
  await app.Product.setSKU({ productId: \<productSKU\>, materialMap: {...}});  
});

| Props | Type | Default | Description | Example |
| :---- | :---- | :---- | :---- | :---- |
| productSKU | string |  | SKU продукта |  |
| materialMap | object | null | Используемые материалы и части | {   legs: ‘materialSKU’,   \[name\]: ‘sku’ } |

| Events | Description |
| :---- | :---- |
| onProductChanged | Выполняется после изменения продукта в основном окне приложения |

OnProductUpdated

#### Product.Item() \- Получить информацию о продукте

window.ZolakConfigurator.onReady('.container', async (*app*) *\=\>* {  
  await app.Product.item();  
});

| Props | Type | Description |
| :---- | :---- | :---- |
| productSKU | string | SKU продукта |

#### 

#### Favorites.add(productSKU) \- Добавить в список понравившихся продуктов

window.ZolakConfigurator.onReady('.container', async (*app*) *\=\>* {  
  await app.Favorites.add({ productId: \<productSKU\> });  
});

| Props | Type | Description |
| :---- | :---- | :---- |
| productSKU | string | SKU продукта |
| materialMap |  |  |

| Events | Description |
| :---- | :---- |
| onFavoritesAdded | Выполняется после добавления в список фаворитов |

#### Favorites.remove(productSKU) \- Удалить из списка понравившихся продуктов

window.ZolakConfigurator.onReady('.container', async (*app*) *\=\>* {  
  await app.Favorites.remove({ productId: \<productSKU\> });  
});

| Props | Type | Description |
| :---- | :---- | :---- |
| productSKU | string | SKU продукта |
| materialMap |  |  |

| Events | Description |
| :---- | :---- |
| onFavoritesRemoved | Выполняется после удаления из списка фаворитов |

#### Favorites.list() \- Получить список понравившихся продуктов

window.ZolakConfigurator.onReady('.container', async (*app*) *\=\>* {  
  await app.Favorites.list();  
});

Параметры и события отсутствуют

# Этапы эволюции приложения 

## V2.0-legacy

## Переходная версия

- Для интеграции со сторонним сайтом используется embed скрипт, который генерирует iframe в сайте клиента и подгружает приложение в нем.  
- Embed скрипт отвечает только за интеграцию iframe, инициализацию приложения, и доставку API приложения в сайт клиента.  
- Вся коммуникация между приложением и сайтом клиента посредством WebApi postMessage.  
- Сохраняется поддержка старой интеграции \!\!\!  
- Активнее используем Redux Store для хранения информации полученной от Backend, для последующей выдачи через API приложения сайту клиента.


## V2.1

## За основу используется версия 2.0-legacy

- Переход на чистое React приложение: избавление от custom-elements подхода  
- Подключение Module Federation для последующего дробления приложения на микрофронтенды  
- Отказ от поддержки Legacy кода  
- Использование Monorepo для возможности переиспользования кода в разных приложениях  
- Добавляем поддержку версионирования модулей (микрофронтендов)  
- Используем подход Feature flags для контроля доступа клиентов к элементам приложения  
- Авторизацию проводить через Backend: делаем интерфейс на котором клиент может выбрать необходимый набор модулей и внести оплату. После оплаты он получает токен который использует на сайте. Токен привязан к домену клиента. При обращении к сайту клиента с приложением, запрос при инициализации уходит на Backend где получает SessionId (хранится только в приложении), с которым работает приложение с Backend API  
- Добавляем Overriding customers для возможности загружать приложение и отдельные модули брендированными под определенных клиентов. В случае успешной авторизации, приложение получает конфиг, который определяет брендирование нашего приложения

Делаем следующую реализацию для Configurator:

1\. Создаем галочку в CMS "Enable Configurator Panel", которая включает левую панель. По default \- галочка включена.  
2\. Добавляем опциональный параметр при инициализации компонета (показать/скрыть панель).

Это позволит как нам контроллировать продаем мы configurator или viewer (при необходимости). А клиенту позволит в случае покупки configurator-а, самому решать какой вид включать для разных инстансов.

Под капотом используем самый быстрый и дешевый вариант \- прячем левую панель (display: none), не выносим ее в отдельный компонент, т.к. сейчас через эту панель приходят нужные параметры.  
В дальнейшем, можем вынести в отдельный компонент, не меняя API.

Время на реализацию, остается как и было \- примерно 2-3 человеко-недели.

**Требования к размерам, контейнеров для встраивания на сайт**

1) **Showroom**  
   Минимально допустимая ширина 600px  
   Оптимальное соотношение сторон составляет 16/9  
   Показываем please rotate при соотношении сторон \< 1:1 (если у нас ширина меньше высоты, т.е то как это работает сейчас)  
   Если ширина меньше допустимой, показываем модалку с предупреждение о достижении лимита ширины и ставим кнопку Open fullscreen  
     
     
   Webview \> 1240  
   1240 \< tabletView  
   952 \< mobileView  
     
     
2) **Configurator**

	  
**Без Левой панели**

- 


  #### **Business Use Case**

  ​  
  The "Popup: Product Configurator" scenario is designed to enhance customer engagement while maintaining a clean, minimalist website layout. By launching the configurator in a popup (modal), you provide a focused environment for product interaction, which is proven to increase conversion rates and reduce product returns through better visualization.  
  ​

  #### **User Flow**

  ​  
1. ​  
   **Discovery:** The user browses the product page and sees a call-to-action button (e.g., "Preview in 3D").  
2. ​  
   **Activation:** Upon clicking the button, the Zolak Configurator launches in a modal overlay.  
3. ​  
   **Interaction:** The user interacts with the 3D model, changes materials, and views the product from all angles.  
4. ​  
   **Exit:** The user closes the modal and returns to the product page.  
   ​  
   ---

   ​

   #### **Implementation Guide**

   ​  
   Change hint settings  
   ​  
   Before you start: Please ensure you have reviewed the System Requirements, completed the Zolak SDK Installation, and obtained your Access Token. These are mandatory steps for Zolak components to initialize and function correctly on your website.  
   ​  
   To implement this scenario, define the trigger element and the application container in your HTML, then initialize the component via JavaScript .  
   ​  
   **1\. HTML Structure**  
   ​  
   Add the trigger button and a hidden container for the application.  
   ​  
   ​  
   \<button id="zolak-preview-btn"\>Preview in 3D\</button\>  
   ​  
   ​  
   \<div id="zolak-app-container"\>\</div\>  
   HTMLCopyMore options  
   ​  
   **2\. Initialize the Configurator**  
   ​  
   Configure the initialization by setting the `modal` parameter to `true` and `sidebar: true`. This ensures the application is prepared to be displayed as an overlay.  
   ​  
   ​  
   window.ZolakAPI.initConfigurator('\<YOUR\_ACCESS\_TOKEN\>', {  
   ​  
   container: '\#zolak-app-container', // Target DOM selector  
   ​  
   product: 'productSKU', // Initial product SKU  
   ​  
   modal: true, // Enables popup/modal behavior  
   ​  
   sidebar: true // Keeps the customization panel visible  
   ​  
   });  
   JavaScriptCopyMore options  
   ​  
   Change hint settings  
   ​  
   Zolak CMS Configuration Required: For the `sidebar: true` parameter to function correctly, the "Configurator sidebar accessible" option must be enabled in your company settings within the Zolak CMS. If this setting is disabled, the sidebar will not appear even if explicitly requested in the code.  
   ​  
   **3\. Trigger the Modal Launch**  
   ​  
   Attach an event listener to your trigger element. Once the application is ready, use the `App.show()` method to display the modal.  
   ​  
   ​  
   const triggerBtn \= document.querySelector('\#zolak-preview-btn');  
   ​  
   ​  
   triggerBtn.addEventListener('click', () \=\> {  
   ​  
   // Ensure the instance is loaded using the onReady helper  
   ​  
   window.ZolakConfigurator.onReady('\#zolak-app-container', async (app) \=\> {  
   ​  
   await app.App.show(); // Display the modal window  
   ​  
   });  
   ​  
   });  
   JavaScriptCopyMore options  
   ​  
   Change hint settings  
   ​  
   Flexible Activation: A button click is just one way to launch the viewer. You can organize the activation using any custom logic — such as a timer, a scroll-based trigger, or an automatic page-load event—as long as the `App.show()` method is called.  
   ​  
   ---

   ​

   #### **More Information**

   ​  
   For a comprehensive list of all available methods, parameters, and events, please visit the Configurator API documentation page.  
   

   #### **Business Use Case**

   ​  
   The "Popup: Product Viewer" mode is a high-performance visual tool designed to showcase a specific product with pre-selected materials. Rather than offering a broad customization suite, this mode highlights a curated design or a hero configuration. It is perfect for situations where you want to provide an immersive 3D preview of a specific item, allowing customers to inspect textures and scale in a focused environment.  
   ​

   #### **User Flow**

   ​  
1. ​  
   **Discovery:** The user browses the product page and clicks a call-to-action (e.g., "View 3D Preview").  
2. ​  
   **Activation:** A modal window launches, displaying the product in its specific configuration.  
3. ​  
   **Observation:** The user rotates and zooms into the product. A streamlined interface provides essential functions and a clear exit point while keeping the focus on the model.  
4. ​  
   **Exit:** The user closes the modal and returns to the product page.  
   ​  
   ---

   ​

   #### **Implementation Guide**

   ​  
   Change hint settings  
   ​  
   Before you start: Please ensure you have reviewed the System Requirements, completed the Zolak SDK Installation, and obtained your Access Token. These are mandatory steps for Zolak components to initialize and function correctly on your website.  
   ​  
   To implement the viewer in popup mode, initialize the component with the `sidebar` disabled and `modal` enabled.  
   ​  
   **1\. HTML Structure**  
   ​  
   Add the trigger element and a container for the application.  
   ​  
   ​  
   \<button id="zolak-viewer-btn"\>View in 3D\</button\>  
   ​  
   ​  
   \<div id="zolak-viewer-container"\>\</div\>  
   HTMLCopyMore options  
   ​  
   **2\. Initialize the Viewer**  
   ​  
   Configure the initialization by setting `modal` to `true` and `sidebar` to `false`.  
   ​  
   ​  
   window.ZolakAPI.initConfigurator('\<YOUR\_ACCESS\_TOKEN\>', {  
   ​  
   container: '\#zolak-viewer-container', // Target DOM selector  
   ​  
   product: 'productSKU', // Specific product SKU  
   ​  
   modal: true, // Enables popup/modal behavior  
   ​  
   sidebar: false // Hides the full customization panel  
   ​  
   });  
   JavaScriptCopyMore options  
   ​  
   **3\. Trigger the Launch**  
   ​  
   Attach an event listener to your trigger. Once the application is ready, use the `App.show()` method to display the modal.  
   ​  
   ​  
   const viewerBtn \= document.querySelector('\#zolak-viewer-btn');  
   ​  
   ​  
   viewerBtn.addEventListener('click', () \=\> {  
   ​  
   // Use the onReady helper to ensure the instance is loaded  
   ​  
   window.ZolakConfigurator.onReady('\#zolak-viewer-container', async (app) \=\> {  
   ​  
   // This method is the key to displaying the modal  
   ​  
   await app.App.show();  
   ​  
   });  
   ​  
   });  
   JavaScriptCopyMore options  
   ​  
   Change hint settings  
   ​  
   Flexible Activation: Using a button click is just one example. You can trigger the viewer using any logic (timers, scroll events, or automatic triggers) as long as you call the `App.show()` method once the instance is ready.  
   ​  
   ---

   ​

   #### **More Information**

   ​  
   For a comprehensive list of all available methods and parameters, please visit the Configurator API documentation page.  
   

   #### **Business Use Case**

   ​  
   This scenario transforms the configurator into a single, autonomous product capsule that entirely replaces the traditional visualization block on your Product Detail Page (PDP). Instead of embedding a standalone 3D player next to a standard image slider, you implement a comprehensive solution that manages everything: real-time 3D exploration, a built-in gallery of static renders, and full configuration controls.  
   ​  
   By making the Zolak Capsule your "single source of truth" for visuals, you minimize visual noise, eliminate the need for third-party gallery plugins, and deliver a seamless, high-tech experience that simplifies the customer purchase journey.  
   ​

   #### **User Flow**

   ​  
1. ​  
   **Entry:** The user arrives at the product page.  
2. ​  
   **Visualization:** Instead of a static image, the user immediately sees the Zolak Capsule, which houses the 3D model and the integrated image gallery.  
3. ​  
   **Interaction:** The user modifies the product's parameters directly through the built-in Sidebar without using external website controls.  
4. ​  
   **Purchase:** All changes are captured within the capsule; when items are added to the cart, the website receives the final configuration data via the Cart API.  
   ​  
   ---

   ​

   #### **Implementation Guide**

   ​  
   Change hint settings  
   ​  
   Before you start: Please ensure you have reviewed the System Requirements, completed the Zolak SDK Installation, and obtained your Access Token. These are mandatory steps for Zolak components to initialize and function correctly on your website.  
   ​  
   In this mode, the configurator operates as an independent block, adapting to its container dimensions and disabling all modal-related UI elements.  
   ​  
   **1\. HTML Structure**  
   ​  
   Create a `div` container that occupies the entire space dedicated to product visualization.  
   ​  
   ​  
   \<div id="zolak-product-capsule" style="width: 100%; height: 600px;"\>\</div\>  
   HTMLCopyMore options  
   ​  
   **2\. Initialize the Configurator**  
   ​  
   Set `modal: false` and `sidebar: true`. This activates the embedded mode with the full internal toolset.  
   ​  
   ​  
   window.ZolakAPI.initConfigurator('\<YOUR\_ACCESS\_TOKEN\>', {  
   ​  
   container: '\#zolak-product-capsule', // Container selector  
   ​  
   product: 'productSKU', // Product SKU  
   ​  
   modal: false, // Disables popup/modal mode  
   ​  
   sidebar: true // Enables the built-in control sidebar  
   ​  
   });  
   JavaScriptCopyMore options  
   ​  
   Change hint settings  
   ​  
   Zolak CMS Configuration Required: For the `sidebar: true` parameter to function correctly, the "Configurator sidebar accessible" option must be enabled in your company settings within the Zolak CMS. If this setting is disabled, the sidebar will not appear even if explicitly requested in the code.  
   ​  
   ---

   ​

   #### **More Information**

   ​  
   For a comprehensive list of all available methods, parameters, and events, please visit the Configurator API documentation page.  
   

   #### **Business Use Case**

   ​  
   The "Embedded: Product Viewer" scenario is designed for brands that want to maintain complete control over their website's user interface and design language. In this configuration, the Zolak Configurator acts as a high-tech 3D viewer embedded directly into the page structure .  
   ​  
   Unlike the "Embedded: Product Configurator" the control elements (such as color swatches, material selectors, and the "Add to Cart" button) remain part of your website's native UI. This allows you to combine your brand's unique aesthetic with Zolak's photorealistic interactivity.  
   ​  
   **Integration Options:**  
   ​  
* ​  
  Full Replacement: The configurator replaces the main product image or the standard gallery slider.  
* ​  
  Gallery Component: Zolak is integrated as an element within the client's existing gallery (e.g., launched via a dedicated "3D" button within the native slider).  
  ​

  #### **User Flow**

  ​  
1. ​  
   **Viewing:** The user opens the page and sees the 3D viewer (either immediately or after switching in the gallery).  
2. ​  
   **Native Interaction:** The user selects parameters using the website's own swatches or buttons.  
3. ​  
   **Synchronization:** The website uses the Zolak API to instantly update the 3D model based on the user's selection.  
4. ​  
   **Purchase:** The checkout process follows the standard website cart flow.  
   ​  
   ---

   ​

   #### **Implementation Guide**

   ​  
   Change hint settings  
   ​  
   Before you start: Please ensure you have reviewed the System Requirements, completed the Zolak SDK Installation, and obtained your Access Token. These are mandatory steps for Zolak components to initialize and function correctly on your website.  
   ​  
   In this mode, the Zolak sidebar is hidden (`sidebar: false`) so that your website's interface fully controls the configuration logic.  
   ​  
   **1\. HTML Structure**  
   ​  
   Place a `div` container where the 3D content should be displayed.  
   ​  
   ​  
   \<div id="zolak-native-viewer" style="width: 100%; height: 500px;"\>\</div\>  
   ​  
   ​  
   \<div class="site-controls"\>  
   ​  
   \<button onclick="changeProduct('SKU-BLACK')"\>Black Color (New SKU)\</button\>  
   ​  
   \<button onclick="changeMaterial('SKU-BLACK', {'upholstery':'velvet\_red'})"\>Red Velvet (MaterialMap)\</button\>  
   ​  
   \</div\>  
   HTMLCopyMore options  
   ​  
   **2\. Initialization**  
   ​  
   Set the `modal: false` and `sidebar: false` parameters to leave only the 3D scene without Zolak's internal controls.  
   ​  
   ​  
   window.ZolakAPI.initConfigurator('\<YOUR\_ACCESS\_TOKEN\>', {  
   ​  
   container: '\#zolak-native-viewer',  
   ​  
   product: 'productSKU',  
   ​  
   materialMap: { 'partName': 'materialSKU', 'partName2': 'materialSKU2' }, //required only for Base Product SKU \+ Material Map Model  
   ​  
   modal: false,  
   ​  
   sidebar: false // Hides the built-in Zolak panel  
   ​  
   });  
   JavaScriptCopyMore options  
   ​  
   **3\. API Synchronization**  
   ​  
   For this integration scenario, all product manipulations should be performed from your site via the Configurator API.  
   ​

   #### **Example:**

   ​  
   ​  
   // Example 1: Set product by Product SKU for Unique Product SKU per Variation Model  
   ​  
   async function changeProduct(newProductSku) {  
   ​  
   window.ZolakConfigurator.onReady('\#zolak-viewer-container', async (app) \=\> {  
   ​  
   await app.Product.setSKU({ productId: newProductSku });  
   ​  
   });  
   ​  
   }  
   ​  
   ​  
   // Example 2: Set product with specific materials for Base Product SKU \+ Material Map Model  
   ​  
   async function changeMaterial(productSKU, materialMap) {  
   ​  
   window.ZolakConfigurator.onReady('\#zolak-viewer-container', async (app) \=\> {  
   ​  
   await app.Product.setSKU({  
   ​  
   productId: productSKU,  
   ​  
   materialMap: materialMap  
   ​  
   });  
   ​  
   });  
   ​  
   }  
   JavaScriptCopyMore options  
   ​  
   ---

   ​

   #### **More Information**

   ​  
   A more detailed description of methods and parameters is available on the Configurator API page.  
   

   #### **Business Use Case**

   ​  
   The "Popup: Showroom Gallery" acts as your digital flagship store. By launching this hub in a full-screen popup, you remove all website distractions, allowing customers to dive into professionally curated interiors. This setup is perfect for driving cross-sales—customers don’t just see an isolated product; they see an entire lifestyle set, making it easier to visualize how multiple items complement each other in a real-world space.  
   ​

   #### **User Flow**

   ​  
1. ​  
   **Entry:** The user clicks a call-to-action like "Explore Showrooms" or "Get Inspired" on your homepage or a landing page.  
2. ​  
   **Gallery Launch:** A full-screen modal opens, displaying a categorized gallery of pre-rendered rooms (e.g., Living Rooms, Bedrooms, Studios).  
3. ​  
   **Selection:** The user selects a room that matches their style or interest.  
4. ​  
   I**nteractive Exploration:** The user moves through the 3D space, interacting with products and different interior configurations.  
5. ​  
   **Shopping Integration:** The user can add products they discover directly to your website's primary shopping cart from within the 3D scene using a dedicated synchronization API.  
6. ​  
   **Return:** The user exits the showroom via the "Back to Website" button, returning seamlessly to the exact spot on your site.  
   ​  
   ---

   ​

   #### **Implementation Guide**

   ​  
   Change hint settings  
   ​  
   Before you start: Please ensure you have reviewed the System Requirements, completed the Zolak SDK Installation, and obtained your Access Token. These are mandatory steps for Zolak components to initialize and function correctly on your website.  
   ​  
   In this scenario, the showroom is initialized in Modal Mode. This creates a full-screen overlay that is triggered programmatically.  
   ​  
   **1\. HTML Structure**  
   ​  
   You only need a trigger element and a container for the SDK to inject the hidden iframe.  
   ​  
   ​  
   \<button id="launch-showroom-btn"\>Explore Virtual Showrooms\</button\>  
   ​  
   ​  
   \<div id="zolak-showroom-container"\>\</div\>  
   HTMLCopyMore options  
   ​  
   **2\. Initialize the Showroom**  
   ​  
   Set `view:'interiors'` to start at the gallery level and `modal:true` to enable the full-screen popup behavior.  
   ​  
   ​  
   window.ZolakAPI.initShowroom('\<YOUR\_ACCESS\_TOKEN\>', {  
   ​  
   container: '\#zolak-showroom-container',  
   ​  
   language: 'en',  
   ​  
   view: 'interiors', // Starts at the gallery screen  
   ​  
   modal: true // Required for the full-screen popup experience  
   ​  
   });  
   JavaScriptCopyMore options  
   ​  
   **3\. Trigger via API**  
   ​  
   Use the `App.show()` method to open the full-screen gallery when your trigger is clicked.  
   ​  
   ​  
   const launchBtn \= document.querySelector('\#launch-showroom-btn');  
   ​  
   ​  
   launchBtn.addEventListener('click', () \=\> {  
   ​  
   // Ensure the instance is ready before calling show()  
   ​  
   window.ZolakShowroom.onReady('\#zolak-showroom-container', async (app) \=\> {  
   ​  
   await app.App.show(); // Expands the showroom to full-screen  
   ​  
   });  
   ​  
   });  
   JavaScriptCopyMore options  
   ​  
   ---

   ​

   #### **More Information**

   ​  
   To learn how to filter which rooms appear in this gallery or how to listen for product clicks within the room, please visit the Showroom API page.  
   

   #### **Business Use Case**

   ​  
   The "Popup: Showroom with Product-Specific Interior" scenario bridges the gap between a product listing and its real-world application. When a customer is on a specific product page, they often struggle to visualize the item's scale, style, and how it pairs with other furniture. By offering a direct link to a 3D showroom where that specific product is already featured, you provide immediate context, reduce buyer hesitation, and significantly increase the likelihood of a multi-item purchase.  
   ​

   #### **User Flow**

   ​  
1. ​  
   **Contextual Trigger:** While browsing a product page (e.g., a specific sofa), the user clicks a "See in a Room" button.  
2. ​  
   **Targeted Entry:** The Zolak Showroom opens in a full-screen modal, bypassing the gallery and taking the user directly into an interior that features the selected product.  
3. ​  
   **Interactive Configuration:** The user can view the product on the interior, rotate the view, and try different materials for that product in the room.  
4. ​  
   **Cart Synchronization:** The user can add the configured product (or other items found in the room) to the website's shopping cart via the Cart API.  
5. ​  
   **Seamless Return:** Closing the showroom returns the user to the original product page.  
   ​  
   ---

   ​

   #### **Implementation Guide**

   ​  
   Change hint settings  
   ​  
   Before you start: Please ensure you have reviewed the System Requirements, completed the Zolak SDK Installation, and obtained your Access Token. These are mandatory steps for Zolak components to initialize and function correctly on your website.  
   ​  
   To launch the Showroom for a specific product, initialize the component with `view: 'product'` and provide the corresponding `productSKU`.  
   ​  
   **1\. HTML Structure**  
   ​  
   Add a trigger button to your PDP and a container for the SDK.  
   ​  
   ​  
   \<button id="see-in-room-btn"\>See this in a Room\</button\>  
   ​  
   ​  
   \<div id="zolak-product-showroom"\>\</div\>  
   JavaScriptCopyMore options  
   ​  
   **2\. Initialize the Showroom**  
   ​  
   Specify the `product` SKU and set the `view` to `'product'` to ensure the showroom loads the relevant interior automatically.  
   ​  
   ​  
   window.ZolakAPI.initShowroom('\<YOUR\_ACCESS\_TOKEN\>', {  
   ​  
   container: '\#zolak-product-showroom',  
   ​  
   language: 'en',  
   ​  
   product: 'SOFA-XYZ-123', // The SKU of the product from your PDP  
   ​  
   view: 'product', // Directs the app to open a room containing this product  
   ​  
   modal: true // Enables the full-screen popup experience  
   ​  
   });  
   JavaScriptCopyMore options  
   ​  
   **3\. Activation Script**  
   ​  
   Trigger the full-screen view when the user clicks the button.  
   ​  
   ​  
   const seeInRoomBtn \= document.querySelector('\#see-in-room-btn');  
   ​  
   ​  
   seeInRoomBtn.addEventListener('click', () \=\> {  
   ​  
   window.ZolakShowroom.onReady('\#zolak-product-showroom', async (app) \=\> {  
   ​  
   await app.App.show(); // Launches the room featuring the product  
   ​  
   });  
   ​  
   });  
   JavaScriptCopyMore options  
   ​  
   ---

   ​

   #### **More Information**

   ​  
   For details on how to handle specific product events or to learn about the data structure for cart synchronization, visit the Showroom API page.  
   

   #### **Business Use Case**

   ​  
   The "Embedded: Showroom Gallery" scenario is designed to maximize user retention by keeping the interactive experience directly within the flow of your page content. Instead of launching a separate window, the showroom acts as an "interactive hero section" or a "virtual walkthrough" block. This is ideal for showcasing specific seasonal collections or brand-new interior concepts, allowing users to engage with your products immediately without the friction of a popup.  
   ​

   #### **User Flow**

   ​  
1. ​  
   **Discovery:** The user scrolls down a landing page or homepage and encounters the interactive showroom block.  
2. ​  
   **Instant Interaction:** Without clicking any buttons to "launch," the user can select the interior and immediately rotate the view, explore products, and change materials.  
3. ​  
   **In-Context Shopping:** The user discovers products and adds them to their cart using the integrated Cart API while remaining on the same page.  
4. ​  
   **Continuous Journey:** The user continues scrolling through other sections of your website (e.g., reviews or technical specs) without losing their position.  
   ​  
   ---

   ​

   #### **Implementation Guide**

   ​  
   Change hint settings  
   ​  
   Before you start: Please ensure you have reviewed the System Requirements, completed the Zolak SDK Installation, and obtained your Access Token. These are mandatory steps for Zolak components to initialize and function correctly on your website.  
   ​  
   In this mode, the showroom behaves like a native web element, automatically removing "modal" UI components to blend into your site's architecture.  
   ​  
   **1\. HTML Structure**  
   ​  
   Place a `div` container within your page layout. Ensure you define a height that suits your design.  
   ​  
   ​  
   \<div id="zolak-embedded-walkthrough" style="width: 100%; height: 600px;"\>\</div\>  
   HTMLCopyMore options  
   ​  
   **2\. Initialize the Embedded View**  
   ​  
   Set `modal: false` and `view: 'interiors'` (or a specific interior) to anchor the showroom to the page.  
   ​  
   ​  
   window.ZolakAPI.initShowroom('\<YOUR\_ACCESS\_TOKEN\>', {  
   ​  
   container: '\#zolak-embedded-walkthrough',  
   ​  
   language: 'en',  
   ​  
   view: 'interiors',  
   ​  
   modal: false, // Disables the popup/takeover behavior  
   ​  
   sidebar: true // Allows users to see the product list/controls  
   ​  
   });  
   JavaScriptCopyMore options  
   ​  
   ---

   ​

   #### **More Information**

   ​  
   For details on how to programmatically work with Showroom within an embedded block or sync cart data, visit the Showroom API page.  
   

   #### **Business Use Case**

   ​  
   The "Embedded: Showroom with Product-Specific Interior" is a high-impact conversion tool for e-commerce platforms. Instead of showing a product in isolation, this mode embeds a 3D environment directly into your page layout that is tailored to that specific item. It helps customers immediately understand scale, styling possibilities, and how the product complements other products, effectively acting as an automated "lifestyle stylist" for every SKU in your catalog.  
   ​

   #### **User Flow**

   ​  
1. ​  
   **Entry:** The user opens a product page (PDP) and sees an interactive 3D scene where the product is already placed.  
2. ​  
   **Discovery:** The user explores the room, rotates the view, and interacts with the product in a real-world context.  
3. ​  
   **Synchronization:** Some changes to the product's materials in the room can be synchronized with your website's state via the Showroom API.  
4. ​  
   **Purchase:** The user adds the product to their cart directly from the interior, carrying over the specific configuration chosen during exploration.  
   ​  
   ---

   ​

   #### **Implementation Guide**

   ​  
   Change hint settings  
   ​  
   Before you start: Please ensure you have reviewed the System Requirements, completed the Zolak SDK Installation, and obtained your Access Token. These are mandatory steps for Zolak components to initialize and function correctly on your website.  
   ​  
   To embed the showroom with a specific product focus, initialize the component with `modal: false` and set the `view` to `'product'`.  
   ​  
   **1\. HTML Structure**  
   ​  
   Create a container in your PDP layout where the interactive interior will be displayed.  
   ​  
   ​  
   \<div id="zolak-product-interior" style="width: 100%; height: 600px;"\>\</div\>  
   HTMLCopyMore options  
   ​  
   **2\. Initialize the Showroom**  
   ​  
   Specify the `product` SKU and ensure `modal` is set to `false` for seamless page integration.  
   ​  
   ​  
   window.ZolakAPI.initShowroom('\<YOUR\_ACCESS\_TOKEN\>', {  
   ​  
   container: '\#zolak-product-interior',  
   ​  
   language: 'en',  
   ​  
   product: 'YOUR-PRODUCT-SKU', // The SKU of the product on the page  
   ​  
   view: 'product', // Automatically loads an interior containing this SKU  
   ​  
   modal: false // Embeds the component directly into the layout  
   ​  
   });  
   JavaScriptCopyMore options  
   ​  
   ---

   ​

   #### **More Information**

   ​  
   For detailed instructions on how to handle product interaction events or to manage the data flow between the showroom and your cart, visit the Showroom API page.  
     
   Configurator API  
   Methods  
   ​

   ### **1\. Initialization**

   ​  
   Initialization of the Configurator using the global Zolak API.  
   ​

   #### **Initialization Example**

   ​  
   ​  
   window.ZolakAPI.initConfigurator('\<YOUR\_ACCESS\_TOKEN\>', {  
   ​  
   container: '.container',  
   ​  
   product: '\<productSKU\>',  
   ​  
   materialMap: { 'partName': 'materialSKU', 'partName2': 'materialSKU2' },  
   ​  
   language: 'en',  
   ​  
   modal: false,  
   ​  
   sidebar: true  
   ​  
   });  
   JavaScriptCopyMore options  
   ​

   #### **Parameters and Options**

   ​  
   To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.

| Text Text | Text Text | Text Text | Text Text | Text Text |
| ----- | ----- | ----- | ----- | ----- |
| **Prop** | **Type** | **Default** | **Required** | **Description** |
| token | `string` | — | Yes | Your unique **Access Token**. |
| options.container | `string` | — | Yes | DOM selector (ID or class) where the app will be embedded. |
| options.product | `string` | — | Yes | SKU of the product to be displayed upon initialization. |
| options.materialMap | `string` | `null` | NO. Required only for Base Product SKU \+ Material Map Model | Initial mapping of parts to specific material SKUs. |
| options.language | `string` | `'en'` | NO | Interface language. Possible options: en, de, fr, es, fi. You can also request the language that you want to add. |
| options.modal | `boolean` | `false` | NO | Whether to display the app in a modal window aka Popup. |
| options.sidebar | `boolean` | `true` | NO | Show or hide the left configuration panel (requires admin permission in Zolak CMS). |
| options.AR | `boolean` | `false` | NO | Enable the AR mode. |

   To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.

   ​

   #### **Events**

   ​

   To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.

| Text Text | Text Text |
| ----- | ----- |
| **Event** | **Description** |
| `onInitialized` | Triggered after the application has finished its initialization process. |

   To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.

   ​

   ---

   ​

   ### **2\. Application methods**

   ​

   Methods related to the overall application instance lifecycle and versioning.

   ​

   #### **App.version()**

   ​

   Returns the current version of the Zolak Configurator.

   ​

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   console.log(await app.App.version());

   ​

   });

   JavaScriptCopyMore options

   ​

   #### **App.destroy()**

   ​

   Closes the application instance and cleans up associated resources.

   ​

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   await app.App.destroy();

   ​

   });

   JavaScriptCopyMore options

   ​

   #### **Events**

   ​

   To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.

| Text Text | Text Text |
| ----- | ----- |
| **Event** | **Description** |
| `onDestroy` | Executed when the application is destoyed. |

   To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.

   ​

   #### **App.show()**

   ​

   Displays the application modal window.

   ​

   Change hint settings

   ​

   This method is available when the application is initialized with the `modal: true` option.

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   await app.App.show();

   ​

   });

   Event Name

   Description

   onShow

   Fires immediately after the application becomes visible on the screen (e.g., when the modal window opens).

   App.hide()

   Hides the application modal window.

   This method is available when the application is initialized with the modal: true option.

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   await app.App.hide();

   ​

   });

   Event

   Description

   onHide

   Fires when the application is hidden or the user manually closes the modal window.

   3\. Product methods

   Methods for updating and retrieving information about the displayed product.

   Product.setSKU(productSKU, materialMap)

   Updates the current product display by its SKU and applies an optional material configuration.

   ​

   // Example 1: Set product by Product SKU for Unique Product SKU per Variation Model

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   await app.Product.setSKU({ productId: '\<productSKU\>' });

   ​

   });

   ​

   ​

   // Example 2: Set product with specific materials for Base Product SKU \+ Material Map Model

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   await app.Product.setSKU({

   ​

   productId: '\<productSKU\>',

   ​

   materialMap: { 'partName1': 'materialSKU1', 'partName2': 'materialSKU2' }

   ​

   });

   ​

   });

   ​

   Parameters

   Prop

   Type

   Default

   Description

   productSKU

   string

   —

   Unique product identifier

   materialMap

   object

   null

   JSON object mapping part names to material SKUs.

   Required

   YES

   NO. Required only for

   Base Product SKU \+ Material Map Model

   Events

   Event

   Description

   onProductChanged

   Triggered after the product has been successfully updated in the application

   Product.item()

   Retrieves information (such as SKU, Description, etc.) regarding the currently active product.

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   console.log(await app.Product.item());

   ​

   });

   4\. Cart methods

   Methods for interacting with the application's integrated shopping cart.

   Cart.add(productSKU, materialMap)

   Adds a specified product to the shopping cart.

   ​

   // Example 1: Add product to Cart by Product SKU for Unique Product SKU per Variation Model

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   await app.Cart.add({ productId: '\<productSKU\>' });

   ​

   });

   ​

   ​

   // Example 2: Add product to Cart with specific materials for Base Product SKU \+ Material Map Model

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   await app.Cart.add({

   ​

   productId: '\<productSKU\>',

   ​

   materialMap: { 'partName1': 'materialSKU1', 'partName2': 'materialSKU2' }

   ​

   });

   ​

   });

   Parameters

   Prop

   Type

   Default

   Description

   productSKU

   string

   —

   Unique product identifier

   materialMap

   object

   null

   JSON object mapping part names to material SKUs.

   Required

   YES

   NO. Required only for

   Base Product SKU \+ Material Map Model

   Events

   Event

   Description

   onCartAdded

   Executed after the item is added to the cart

   Cart.remove(productSKU, materialMap)

   Removes a specified product from the shopping cart.

   ​

   // Example 1: Remove product from Cart by Product SKU for Unique Product SKU per Variation Model

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   await app.Cart.remove({ productId: '\<productSKU\>' });

   ​

   });

   ​

   ​

   // Example 2: Remove product from Cart with specific materials for Base Product SKU \+ Material Map Model

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   await app.Cart.remove({

   ​

   productId: '\<productSKU\>',

   ​

   materialMap: { 'partName1': 'materialSKU1', 'partName2': 'materialSKU2' }

   ​

   });

   ​

   });

   Parameters

   Prop

   Type

   Default

   Description

   productSKU

   string

   —

   Unique product identifier

   materialMap

   object

   null

   JSON object mapping part names to material SKUs.

   Required

   YES

   NO. Required only for

   Base Product SKU \+ Material Map Model

   Events

   Event

   Description

   onCartRemoved

   Executed after the item is removed from the cart

   Cart.list()

   Retrieves the list of products currently present in the cart.

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   console.log(await app.Cart.list());

   ​

   });

   5\. Favorite Methods

   These methods will be available in the next release.

   Methods for managing the list of products marked as favorites.

   Favorites.add(productSKU, materialMap)

   Adds a product to the user's favorites list.

   ​

   // Example 1: Add product to Favorites by Product SKU for Unique Product SKU per Variation Model

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   await app.Favorites.add({ productId: '\<productSKU\>' });

   ​

   });

   ​

   ​

   // Example 2: Add product to Favorites with specific materials for Base Product SKU \+ Material Map Model

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   await app.Favorites.add({

   ​

   productId: '\<productSKU\>',

   ​

   materialMap: { 'partName1': 'materialSKU1', 'partName2': 'materialSKU2' }

   ​

   });

   ​

   });

   Parameters

   Prop

   Type

   Default

   Description

   productSKU

   string

   —

   Unique product identifier

   materialMap

   object

   null

   JSON object mapping part names to material SKUs.

   Required

   YES

   NO. Required only for

   Base Product SKU \+ Material Map Model

   Events

   Event

   Description

   onFavoritesAdded

   Executed after the product is added to favorites.

   Favorites.remove(productSKU, materialMap)

   Removes a product from the favorites list.

   ​

   // Example 1: Remove product from Favorites by Product SKU for Unique Product SKU per Variation Model

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   await app.Favorites.remove({ productId: '\<productSKU\>' });

   ​

   });

   ​

   ​

   // Example 2: Remove product from Favorites with specific materials for Base Product SKU \+ Material Map Model

   ​

   window.ZolakConfigurator.remove('.container', async (app) \=\> {

   ​

   await app.Favorites.add({

   ​

   productId: '\<productSKU\>',

   ​

   materialMap: { 'partName1': 'materialSKU1', 'partName2': 'materialSKU2' }

   ​

   });

   ​

   });

   ​

   Parameters

   Prop

   Type

   Default

   Description

   productSKU

   string

   —

   Unique product identifier

   materialMap

   object

   null

   JSON object mapping part names to material SKUs.

   Required

   YES

   NO. Required only for

   Base Product SKU \+ Material Map Model

   Events

   Event

   Description

   onFavoritesRemoved

   Executed after the product is removed from favorites.

   Favorites.list()

   Returns the list of products currently in the favorites list.

   ​

   window.ZolakConfigurator.onReady('.container', async (app) \=\> {

   ​

   console.log(await app.Favorites.list());

   ​

   });

   

   Showroom API

   

   ### **1\. Initialization**

   ​

   Initialization of the Showroom using the global Zolak API.

   ​

   #### **Initialization Example**

   ​

   ​

   window.ZolakAPI.initShowroom('\<YOUR\_ACCESS\_TOKEN\>', {

   ​

   container: '.container',

   ​

   language: 'en',

   ​

   modal: false,

   ​

   view: 'interiors',

   ​

   filters: \[\]

   ​

   });

   JavaScriptCopyMore options

   ​

   #### **Parameters and Options**

   ​

   To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.

| Text Text | Text Text | Text Text | Text Text | Text Text |
| ----- | ----- | ----- | ----- | ----- |
| **Prop** | **Type** | **Default** | **Required** | **Description** |
| token | `string` | — | Yes | Your unique **Access Token**. |
| options.container | `string` | — | Yes | DOM selector (ID or class) where the app will be embedded. |
| options.product | `string` | — | NO. Required only in case of running Showroom with Product-Specific Interior. | SKU of the product to be displayed upon initialization. |
| options.materialMap | `string` | `null` | NO. Required only in case of running Showroom with Product-Specific Interior and for Base Product SKU \+ Material Map Model | Initial mapping of parts to specific material SKUs. |
| options.language | `string` | `'en'` | NO | Interface language. Possible options: en, de, fr, es, fi. You can also request the language that you want to add. |
| options.modal | `boolean` | `false` | NO | Whether to display the app in a modal window aka Popup. |
| options.view | `string` | `'interiors'` | NO | Initial view mode: `'interiors'` or `'product'`. Use `'interior'` to start with the gallery of interiors or `'product'` to display an interior scene with a specified product. |
| options.filters | `array` | `[]` |  | Array of filters to apply to the showroom content. See the table with available filters below. |

   To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.

   ​

   #### **Available filters**

   ​

   To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.

| Filter Name Filter Name | Possible Options Possible Options | Description Description |
| ----- | ----- | ----- |
| `room-type` | `showrooms`, `my-rooms`, `all` | Defines the source of the room: professionally designed spaces, user-uploaded photos, or both. |
| `room-category` | `living-room`, `bedroom`, `home-office`, `outdoor`, `hall`, `all`, etc. | Filters scenes by their functional purpose (e.g., only showing bedrooms). |
| `furniture-type` | `sofas`, `beds`, `desks`, `armchairs`, `dining-tables`, `all`, etc. | Filters scenes based on the primary furniture types available within them. |
| `furnishing-level` | `empty`, `semi-furnished`, `fully-furnished`, `all` | Filters rooms by their density of existing furniture and decor. |

   To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.

   ​

   #### **Events**

   ​

   To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.

| Text Text | Text Text |
| ----- | ----- |
| **Event** | **Description** |
| `onInitialized` | Triggered after the showroom application has finished initializing. |

   To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item. Press space again to drop the item in its new position, or press escape to cancel.

   ​

   ---

   ​

   ### **2\. Application methods**

   ​

   Methods related to the overall application instance lifecycle and versioning.

   ​

   #### **App.version()**

   ​

   Returns the current version of the Zolak Showroom.

   ​

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   await app.App.version();

   ​

   });

   JavaScriptCopyMore options

   App.destroy()

   Closes the application instance and cleans up associated resources.

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   await app.App.destroy();

   ​

   });

   Events

   Event

   Description

   onDestroy

   Executed when the application is destoyed.

   App.show()

   Displays the application modal window.

   This method is available when the application is initialized with the modal: true option.

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   await app.App.show();

   ​

   });

   Event

   Description

   onShow

   Fires immediately after the application becomes visible on the screen (e.g., when the modal window opens).

   App.hide()

   Hides the application modal window.

   This method is available when the application is initialized with the modal: true option.

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   await app.App.hide();

   ​

   });

   Event

   Description

   onHide

   Fires when the application is hidden or the user manually closes the modal window.

   3\. Product methods

   Currently, the Zolak Showroom operates as a self-contained environment, meaning it does not yet support external product management (the ability to programmatically add, remove, or modify products from your website's UI).

   However, the API provides a powerful set of Product Events. These allow your website to "listen" and react to any product-related actions the user takes inside the 3D scene, ensuring your external UI and analytics stay perfectly in sync.

   Events

   Event

   Description

   onProductAdded

   Triggered when a new product is placed into the scene.

   onProductChanged

   Triggered when an existing product in the scene is replaced by a different product.

   onProductUpdated

   Triggered when the configuration (e.g., materials or colors) of a product already in the scene is changed.

   onProductRemoved

   Triggered when a product is removed from the current scene.

   4\. Interior Methods

   Methods specifically for interacting with interior scenes.

   Interiors.item()

   Retrieves information about the currently active interior scene.

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   console.log(await app.Interiors.item());

   ​

   });

   5\. Cart Methods

   Methods for interacting with the application's integrated shopping cart.

   Cart.add(productSKU, materialMap)

   Adds a specified product to the shopping cart.

   ​

   // Example 1: Add product to Cart by Product SKU for Unique Product SKU per Variation Model

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   await app.Cart.add({ productId: '\<productSKU\>' });

   ​

   });

   ​

   ​

   // Example 2: Add product to Cart with specific materials for Base Product SKU \+ Material Map Model

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   await app.Cart.add({

   ​

   productId: '\<productSKU\>',

   ​

   materialMap: { 'partName1': 'materialSKU1', 'partName2': 'materialSKU2' }

   ​

   });

   ​

   });

   Parameters

   Prop

   Type

   Default

   Description

   productSKU

   string

   —

   Unique product identifier

   materialMap

   object

   null

   JSON object mapping part names to material SKUs.

   Required

   YES

   NO. Required only for

   Base Product SKU \+ Material Map Model

   Events

   Event

   Description

   onCartAdded

   Executed after the item is added to the cart

   Cart.remove(productSKU, materialMap)

   Removes a specified product from the shopping cart.

   ​

   // Example 1: Remove product from Cart by Product SKU for Unique Product SKU per Variation Model

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   await app.Cart.remove({ productId: '\<productSKU\>' });

   ​

   });

   ​

   ​

   // Example 2: Remove product from Cart with specific materials for Base Product SKU \+ Material Map Model

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   await app.Cart.remove({

   ​

   productId: '\<productSKU\>',

   ​

   materialMap: { 'partName1': 'materialSKU1', 'partName2': 'materialSKU2' }

   ​

   });

   ​

   });

   Parameters

   Prop

   Type

   Default

   Description

   productSKU

   string

   —

   Unique product identifier

   materialMap

   object

   null

   JSON object mapping part names to material SKUs.

   Required

   YES

   NO. Required only for

   Base Product SKU \+ Material Map Model

   Events

   Event

   Description

   onCartRemoved

   Executed after the item is removed from the cart

   Cart.list()

   Retrieves the list of products currently present in the cart.

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   console.log(await app.Cart.list());

   ​

   });

   6\. Favorite Methods

   These methods will be available in the next release.

   Methods for managing the list of products marked as favorites.

   Favorites.add(productSKU, materialMap)

   Adds a product to the user's favorites list.

   ​

   // Example 1: Add product to Favorites by Product SKU for Unique Product SKU per Variation Model

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   await app.Favorites.add({ productId: '\<productSKU\>' });

   ​

   });

   ​

   ​

   // Example 2: Add product to Favorites with specific materials for Base Product SKU \+ Material Map Model

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   await app.Favorites.add({

   ​

   productId: '\<productSKU\>',

   ​

   materialMap: { 'partName1': 'materialSKU1', 'partName2': 'materialSKU2' }

   ​

   });

   ​

   });

   Parameters

   Prop

   Type

   Default

   Description

   productSKU

   string

   —

   Unique product identifier

   materialMap

   object

   null

   JSON object mapping part names to material SKUs.

   Required

   YES

   NO. Required only for

   Base Product SKU \+ Material Map Model

   Events

   Event

   Description

   onFavoritesAdded

   Executed after the product is added to favorites.

   Favorites.remove(productSKU, materialMap)

   Removes a product from the favorites list.

   ​

   // Example 1: Remove product from Favorites by Product SKU for Unique Product SKU per Variation Model

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   await app.Favorites.remove({ productId: '\<productSKU\>' });

   ​

   });

   ​

   ​

   // Example 2: Remove product from Favorites with specific materials for Base Product SKU \+ Material Map Model

   ​

   window.ZolakShowroom.remove('.container', async (app) \=\> {

   ​

   await app.Favorites.add({

   ​

   productId: '\<productSKU\>',

   ​

   materialMap: { 'partName1': 'materialSKU1', 'partName2': 'materialSKU2' }

   ​

   });

   ​

   });

   Parameters

   Prop

   Type

   Default

   Description

   productSKU

   string

   —

   Unique product identifier

   materialMap

   object

   null

   JSON object mapping part names to material SKUs.

   Required

   YES

   NO. Required only for

   Base Product SKU \+ Material Map Model

   Events

   Event

   Description

   onFavoritesRemoved

   Executed after the product is removed from favorites.

   Favorites.list()

   Returns the list of products currently in the favorites list.

   ​

   window.ZolakShowroom.onReady('.container', async (app) \=\> {

   ​

   console.log(await app.Favorites.list());

   ​

   });

   