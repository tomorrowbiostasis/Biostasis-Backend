'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">biostasis documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthorizationModule.html" data-type="entity-link" >AuthorizationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthorizationModule-b934fa67b6937f8273495e82d4a739fdface140ce28f38d7f9897c9a54ecf59b6d7faf0f147a0d9233c27f3762c9c57af6c63fb56622ff5d09e7c70e3ca43423"' : 'data-target="#xs-controllers-links-module-AuthorizationModule-b934fa67b6937f8273495e82d4a739fdface140ce28f38d7f9897c9a54ecf59b6d7faf0f147a0d9233c27f3762c9c57af6c63fb56622ff5d09e7c70e3ca43423"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthorizationModule-b934fa67b6937f8273495e82d4a739fdface140ce28f38d7f9897c9a54ecf59b6d7faf0f147a0d9233c27f3762c9c57af6c63fb56622ff5d09e7c70e3ca43423"' :
                                            'id="xs-controllers-links-module-AuthorizationModule-b934fa67b6937f8273495e82d4a739fdface140ce28f38d7f9897c9a54ecf59b6d7faf0f147a0d9233c27f3762c9c57af6c63fb56622ff5d09e7c70e3ca43423"' }>
                                            <li class="link">
                                                <a href="controllers/GetAccessTokenController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GetAccessTokenController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/LogoutController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogoutController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthorizationModule-b934fa67b6937f8273495e82d4a739fdface140ce28f38d7f9897c9a54ecf59b6d7faf0f147a0d9233c27f3762c9c57af6c63fb56622ff5d09e7c70e3ca43423"' : 'data-target="#xs-injectables-links-module-AuthorizationModule-b934fa67b6937f8273495e82d4a739fdface140ce28f38d7f9897c9a54ecf59b6d7faf0f147a0d9233c27f3762c9c57af6c63fb56622ff5d09e7c70e3ca43423"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthorizationModule-b934fa67b6937f8273495e82d4a739fdface140ce28f38d7f9897c9a54ecf59b6d7faf0f147a0d9233c27f3762c9c57af6c63fb56622ff5d09e7c70e3ca43423"' :
                                        'id="xs-injectables-links-module-AuthorizationModule-b934fa67b6937f8273495e82d4a739fdface140ce28f38d7f9897c9a54ecf59b6d7faf0f147a0d9233c27f3762c9c57af6c63fb56622ff5d09e7c70e3ca43423"' }>
                                        <li class="link">
                                            <a href="injectables/AuthenticationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CognitoStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CognitoStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ContactModule.html" data-type="entity-link" >ContactModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ContactModule-55dcc954569a86ff245127a63cdbf83e57a0c93952da6ab7440c465eb8cb3d979e4814a0e11a9c40abaccb4ab2868897baee054272bb8a24ea19e7215bc8e402"' : 'data-target="#xs-controllers-links-module-ContactModule-55dcc954569a86ff245127a63cdbf83e57a0c93952da6ab7440c465eb8cb3d979e4814a0e11a9c40abaccb4ab2868897baee054272bb8a24ea19e7215bc8e402"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ContactModule-55dcc954569a86ff245127a63cdbf83e57a0c93952da6ab7440c465eb8cb3d979e4814a0e11a9c40abaccb4ab2868897baee054272bb8a24ea19e7215bc8e402"' :
                                            'id="xs-controllers-links-module-ContactModule-55dcc954569a86ff245127a63cdbf83e57a0c93952da6ab7440c465eb8cb3d979e4814a0e11a9c40abaccb4ab2868897baee054272bb8a24ea19e7215bc8e402"' }>
                                            <li class="link">
                                                <a href="controllers/AddContactController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddContactController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ContactListController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactListController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DeleteContactController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeleteContactController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UpdateContactController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateContactController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ContactModule-55dcc954569a86ff245127a63cdbf83e57a0c93952da6ab7440c465eb8cb3d979e4814a0e11a9c40abaccb4ab2868897baee054272bb8a24ea19e7215bc8e402"' : 'data-target="#xs-injectables-links-module-ContactModule-55dcc954569a86ff245127a63cdbf83e57a0c93952da6ab7440c465eb8cb3d979e4814a0e11a9c40abaccb4ab2868897baee054272bb8a24ea19e7215bc8e402"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ContactModule-55dcc954569a86ff245127a63cdbf83e57a0c93952da6ab7440c465eb8cb3d979e4814a0e11a9c40abaccb4ab2868897baee054272bb8a24ea19e7215bc8e402"' :
                                        'id="xs-injectables-links-module-ContactModule-55dcc954569a86ff245127a63cdbf83e57a0c93952da6ab7440c465eb8cb3d979e4814a0e11a9c40abaccb4ab2868897baee054272bb8a24ea19e7215bc8e402"' }>
                                        <li class="link">
                                            <a href="injectables/ContactService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FileModule.html" data-type="entity-link" >FileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-FileModule-07fd74c7cd59deb002bf16c97d52cbdc64926e3d14a6e3759cf525e98e56aa48499856d8b0ffe3edda18beab120e252dafed13e44733910d0fb9494f863fb89e"' : 'data-target="#xs-controllers-links-module-FileModule-07fd74c7cd59deb002bf16c97d52cbdc64926e3d14a6e3759cf525e98e56aa48499856d8b0ffe3edda18beab120e252dafed13e44733910d0fb9494f863fb89e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-FileModule-07fd74c7cd59deb002bf16c97d52cbdc64926e3d14a6e3759cf525e98e56aa48499856d8b0ffe3edda18beab120e252dafed13e44733910d0fb9494f863fb89e"' :
                                            'id="xs-controllers-links-module-FileModule-07fd74c7cd59deb002bf16c97d52cbdc64926e3d14a6e3759cf525e98e56aa48499856d8b0ffe3edda18beab120e252dafed13e44733910d0fb9494f863fb89e"' }>
                                            <li class="link">
                                                <a href="controllers/DeleteContactController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeleteContactController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/FileListController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FileListController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UploadFileController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadFileController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-FileModule-07fd74c7cd59deb002bf16c97d52cbdc64926e3d14a6e3759cf525e98e56aa48499856d8b0ffe3edda18beab120e252dafed13e44733910d0fb9494f863fb89e"' : 'data-target="#xs-injectables-links-module-FileModule-07fd74c7cd59deb002bf16c97d52cbdc64926e3d14a6e3759cf525e98e56aa48499856d8b0ffe3edda18beab120e252dafed13e44733910d0fb9494f863fb89e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FileModule-07fd74c7cd59deb002bf16c97d52cbdc64926e3d14a6e3759cf525e98e56aa48499856d8b0ffe3edda18beab120e252dafed13e44733910d0fb9494f863fb89e"' :
                                        'id="xs-injectables-links-module-FileModule-07fd74c7cd59deb002bf16c97d52cbdc64926e3d14a6e3759cf525e98e56aa48499856d8b0ffe3edda18beab120e252dafed13e44733910d0fb9494f863fb89e"' }>
                                        <li class="link">
                                            <a href="injectables/FileCategoryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FileCategoryService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FileService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FileService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MessageModule.html" data-type="entity-link" >MessageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-MessageModule-fff8dc96c9060abbfbfde45cef3ed452ae5373ba57e73a1bc990644c384dab0c1f3545270480d61011b4fb5a9dedea27da6d722eeeb90a617a3a9ce5fe37edfe"' : 'data-target="#xs-controllers-links-module-MessageModule-fff8dc96c9060abbfbfde45cef3ed452ae5373ba57e73a1bc990644c384dab0c1f3545270480d61011b4fb5a9dedea27da6d722eeeb90a617a3a9ce5fe37edfe"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MessageModule-fff8dc96c9060abbfbfde45cef3ed452ae5373ba57e73a1bc990644c384dab0c1f3545270480d61011b4fb5a9dedea27da6d722eeeb90a617a3a9ce5fe37edfe"' :
                                            'id="xs-controllers-links-module-MessageModule-fff8dc96c9060abbfbfde45cef3ed452ae5373ba57e73a1bc990644c384dab0c1f3545270480d61011b4fb5a9dedea27da6d722eeeb90a617a3a9ce5fe37edfe"' }>
                                            <li class="link">
                                                <a href="controllers/CancelEmergencyMessageController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CancelEmergencyMessageController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/SendEmergencyMessageController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SendEmergencyMessageController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/SendSMSController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SendSMSController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-MessageModule-fff8dc96c9060abbfbfde45cef3ed452ae5373ba57e73a1bc990644c384dab0c1f3545270480d61011b4fb5a9dedea27da6d722eeeb90a617a3a9ce5fe37edfe"' : 'data-target="#xs-injectables-links-module-MessageModule-fff8dc96c9060abbfbfde45cef3ed452ae5373ba57e73a1bc990644c384dab0c1f3545270480d61011b4fb5a9dedea27da6d722eeeb90a617a3a9ce5fe37edfe"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MessageModule-fff8dc96c9060abbfbfde45cef3ed452ae5373ba57e73a1bc990644c384dab0c1f3545270480d61011b4fb5a9dedea27da6d722eeeb90a617a3a9ce5fe37edfe"' :
                                        'id="xs-injectables-links-module-MessageModule-fff8dc96c9060abbfbfde45cef3ed452ae5373ba57e73a1bc990644c384dab0c1f3545270480d61011b4fb5a9dedea27da6d722eeeb90a617a3a9ce5fe37edfe"' }>
                                        <li class="link">
                                            <a href="injectables/MessageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotificationModule.html" data-type="entity-link" >NotificationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-NotificationModule-198d94ae59a7c92b9e69398e3952621c223d1c30835761e54173a802c4c2f84bccd0ba1ad68a4f60e5775eec37ef87994dcaea212f890d5aecb09ae4ae522d0f"' : 'data-target="#xs-injectables-links-module-NotificationModule-198d94ae59a7c92b9e69398e3952621c223d1c30835761e54173a802c4c2f84bccd0ba1ad68a4f60e5775eec37ef87994dcaea212f890d5aecb09ae4ae522d0f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NotificationModule-198d94ae59a7c92b9e69398e3952621c223d1c30835761e54173a802c4c2f84bccd0ba1ad68a4f60e5775eec37ef87994dcaea212f890d5aecb09ae4ae522d0f"' :
                                        'id="xs-injectables-links-module-NotificationModule-198d94ae59a7c92b9e69398e3952621c223d1c30835761e54173a802c4c2f84bccd0ba1ad68a4f60e5775eec37ef87994dcaea212f890d5aecb09ae4ae522d0f"' }>
                                        <li class="link">
                                            <a href="injectables/NotificationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/QueueModule.html" data-type="entity-link" >QueueModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-QueueModule-9c72e89264747ef70403a82d7fe41cc9d05acaed8db613881f885bbaf07d124f7d01e947d7422cc9108b82027ad79914d01ee2484a5f9bf268318c73be65134b"' : 'data-target="#xs-injectables-links-module-QueueModule-9c72e89264747ef70403a82d7fe41cc9d05acaed8db613881f885bbaf07d124f7d01e947d7422cc9108b82027ad79914d01ee2484a5f9bf268318c73be65134b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-QueueModule-9c72e89264747ef70403a82d7fe41cc9d05acaed8db613881f885bbaf07d124f7d01e947d7422cc9108b82027ad79914d01ee2484a5f9bf268318c73be65134b"' :
                                        'id="xs-injectables-links-module-QueueModule-9c72e89264747ef70403a82d7fe41cc9d05acaed8db613881f885bbaf07d124f7d01e947d7422cc9108b82027ad79914d01ee2484a5f9bf268318c73be65134b"' }>
                                        <li class="link">
                                            <a href="injectables/MessageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SchedulerModule.html" data-type="entity-link" >SchedulerModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SchedulerModule-06af72f8fabe02d433a0d3c3610dec9cefe44a80ecf582617a351bbf36c7ccf52e7f3d781539cfc8a35b1d99818e1d25dd1c98833d72bf12fc6b137ffbe47401"' : 'data-target="#xs-injectables-links-module-SchedulerModule-06af72f8fabe02d433a0d3c3610dec9cefe44a80ecf582617a351bbf36c7ccf52e7f3d781539cfc8a35b1d99818e1d25dd1c98833d72bf12fc6b137ffbe47401"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SchedulerModule-06af72f8fabe02d433a0d3c3610dec9cefe44a80ecf582617a351bbf36c7ccf52e7f3d781539cfc8a35b1d99818e1d25dd1c98833d72bf12fc6b137ffbe47401"' :
                                        'id="xs-injectables-links-module-SchedulerModule-06af72f8fabe02d433a0d3c3610dec9cefe44a80ecf582617a351bbf36c7ccf52e7f3d781539cfc8a35b1d99818e1d25dd1c98833d72bf12fc6b137ffbe47401"' }>
                                        <li class="link">
                                            <a href="injectables/SchedulerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SchedulerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TriggerTimeSlotModule.html" data-type="entity-link" >TriggerTimeSlotModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-TriggerTimeSlotModule-02692083da7bb23a6f7fa8b984c4d8ea8b14ef62567f0186b4a0c4a288e3a7bf3e8c4b8efe9e741dc5355850a9aefed751e3457609644fc1ab83991c73f01a90"' : 'data-target="#xs-controllers-links-module-TriggerTimeSlotModule-02692083da7bb23a6f7fa8b984c4d8ea8b14ef62567f0186b4a0c4a288e3a7bf3e8c4b8efe9e741dc5355850a9aefed751e3457609644fc1ab83991c73f01a90"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TriggerTimeSlotModule-02692083da7bb23a6f7fa8b984c4d8ea8b14ef62567f0186b4a0c4a288e3a7bf3e8c4b8efe9e741dc5355850a9aefed751e3457609644fc1ab83991c73f01a90"' :
                                            'id="xs-controllers-links-module-TriggerTimeSlotModule-02692083da7bb23a6f7fa8b984c4d8ea8b14ef62567f0186b4a0c4a288e3a7bf3e8c4b8efe9e741dc5355850a9aefed751e3457609644fc1ab83991c73f01a90"' }>
                                            <li class="link">
                                                <a href="controllers/AddTimeSlotController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddTimeSlotController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DeleteTimeSlotController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeleteTimeSlotController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/GetListOfTimeSlotsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GetListOfTimeSlotsController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UpdateTimeSlotController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateTimeSlotController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TriggerTimeSlotModule-02692083da7bb23a6f7fa8b984c4d8ea8b14ef62567f0186b4a0c4a288e3a7bf3e8c4b8efe9e741dc5355850a9aefed751e3457609644fc1ab83991c73f01a90"' : 'data-target="#xs-injectables-links-module-TriggerTimeSlotModule-02692083da7bb23a6f7fa8b984c4d8ea8b14ef62567f0186b4a0c4a288e3a7bf3e8c4b8efe9e741dc5355850a9aefed751e3457609644fc1ab83991c73f01a90"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TriggerTimeSlotModule-02692083da7bb23a6f7fa8b984c4d8ea8b14ef62567f0186b4a0c4a288e3a7bf3e8c4b8efe9e741dc5355850a9aefed751e3457609644fc1ab83991c73f01a90"' :
                                        'id="xs-injectables-links-module-TriggerTimeSlotModule-02692083da7bb23a6f7fa8b984c4d8ea8b14ef62567f0186b4a0c4a288e3a7bf3e8c4b8efe9e741dc5355850a9aefed751e3457609644fc1ab83991c73f01a90"' }>
                                        <li class="link">
                                            <a href="injectables/TriggerTimeSlotService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TriggerTimeSlotService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-15094c469cff7bc03b660abe7f6f2deec607494f5dfcd9b8db608333e0c3b280eef6ff846b2171edc0d69c5f9644817a2c6fa53eeb20a0a82e840ff468b6394f"' : 'data-target="#xs-controllers-links-module-UserModule-15094c469cff7bc03b660abe7f6f2deec607494f5dfcd9b8db608333e0c3b280eef6ff846b2171edc0d69c5f9644817a2c6fa53eeb20a0a82e840ff468b6394f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-15094c469cff7bc03b660abe7f6f2deec607494f5dfcd9b8db608333e0c3b280eef6ff846b2171edc0d69c5f9644817a2c6fa53eeb20a0a82e840ff468b6394f"' :
                                            'id="xs-controllers-links-module-UserModule-15094c469cff7bc03b660abe7f6f2deec607494f5dfcd9b8db608333e0c3b280eef6ff846b2171edc0d69c5f9644817a2c6fa53eeb20a0a82e840ff468b6394f"' }>
                                            <li class="link">
                                                <a href="controllers/ConfirmUserEmailController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmUserEmailController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DeleteUserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeleteUserController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ExportUserDataController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExportUserDataController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/GetUserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GetUserController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/NotePositiveInfoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotePositiveInfoController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/SendTestMessageController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SendTestMessageController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UpdateUserDeviceIdentifierController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateUserDeviceIdentifierController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UpdateUserProfileController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateUserProfileController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-15094c469cff7bc03b660abe7f6f2deec607494f5dfcd9b8db608333e0c3b280eef6ff846b2171edc0d69c5f9644817a2c6fa53eeb20a0a82e840ff468b6394f"' : 'data-target="#xs-injectables-links-module-UserModule-15094c469cff7bc03b660abe7f6f2deec607494f5dfcd9b8db608333e0c3b280eef6ff846b2171edc0d69c5f9644817a2c6fa53eeb20a0a82e840ff468b6394f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-15094c469cff7bc03b660abe7f6f2deec607494f5dfcd9b8db608333e0c3b280eef6ff846b2171edc0d69c5f9644817a2c6fa53eeb20a0a82e840ff468b6394f"' :
                                        'id="xs-injectables-links-module-UserModule-15094c469cff7bc03b660abe7f6f2deec607494f5dfcd9b8db608333e0c3b280eef6ff846b2171edc0d69c5f9644817a2c6fa53eeb20a0a82e840ff468b6394f"' }>
                                        <li class="link">
                                            <a href="injectables/ExportService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExportService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PositiveInfoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PositiveInfoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProfileService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UnconfirmedEmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UnconfirmedEmailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/ContactEntity.html" data-type="entity-link" >ContactEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/FileCategoryEntity.html" data-type="entity-link" >FileCategoryEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/FileEntity.html" data-type="entity-link" >FileEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PositiveInfoEntity.html" data-type="entity-link" >PositiveInfoEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProfileEntity.html" data-type="entity-link" >ProfileEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TimeSlotDayEntity.html" data-type="entity-link" >TimeSlotDayEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TimeSlotEntity.html" data-type="entity-link" >TimeSlotEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UnconfirmedEmailEntity.html" data-type="entity-link" >UnconfirmedEmailEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserEntity.html" data-type="entity-link" >UserEntity</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AddAccountSettingsColumnsToProfileTable1626771292134.html" data-type="entity-link" >AddAccountSettingsColumnsToProfileTable1626771292134</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddAlertTimeToPositiveInfoTable1650544527662.html" data-type="entity-link" >AddAlertTimeToPositiveInfoTable1650544527662</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddAutomatedEmergencySettings1628507521688.html" data-type="entity-link" >AddAutomatedEmergencySettings1628507521688</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddContactAndCheckPhoneDTO.html" data-type="entity-link" >AddContactAndCheckPhoneDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddContactDTO.html" data-type="entity-link" >AddContactDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddContactTable1625819654567.html" data-type="entity-link" >AddContactTable1625819654567</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddDeviceIdToUserTable1632482760947.html" data-type="entity-link" >AddDeviceIdToUserTable1632482760947</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddEmergencyButtonColumnsToProfileTable1626779640972.html" data-type="entity-link" >AddEmergencyButtonColumnsToProfileTable1626779640972</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddFileCategoryTableWithValues1630406730426.html" data-type="entity-link" >AddFileCategoryTableWithValues1630406730426</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddFileDTO.html" data-type="entity-link" >AddFileDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddFileTable1630406751456.html" data-type="entity-link" >AddFileTable1630406751456</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddLimitToFileCategoryTable1634809042779.html" data-type="entity-link" >AddLimitToFileCategoryTable1634809042779</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddLocationToPositiveInfoTable1633335269397.html" data-type="entity-link" >AddLocationToPositiveInfoTable1633335269397</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddLocationUrlToProfile1651485257652.html" data-type="entity-link" >AddLocationUrlToProfile1651485257652</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddMedicalInfoColumnsToProfileTable1626332132301.html" data-type="entity-link" >AddMedicalInfoColumnsToProfileTable1626332132301</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddPositiveInfoTable1632807482818.html" data-type="entity-link" >AddPositiveInfoTable1632807482818</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddProfileTable1626246168913.html" data-type="entity-link" >AddProfileTable1626246168913</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddPulseBasedColumnsToProfileTable1635501555344.html" data-type="entity-link" >AddPulseBasedColumnsToProfileTable1635501555344</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddPushNotificationTimeToPositiveInfoTable1632979503392.html" data-type="entity-link" >AddPushNotificationTimeToPositiveInfoTable1632979503392</a>
                            </li>
                            <li class="link">
                                <a href="classes/addRegularNotificationDateToProfileTable1633344018695.html" data-type="entity-link" >addRegularNotificationDateToProfileTable1633344018695</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddRegularPushNotificationAndFrequencySettingsToProfileTable1632733981245.html" data-type="entity-link" >AddRegularPushNotificationAndFrequencySettingsToProfileTable1632733981245</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddRoleToUserTable1625843279739.html" data-type="entity-link" >AddRoleToUserTable1625843279739</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddSmsTimeToPositiveInfoTable1632995635641.html" data-type="entity-link" >AddSmsTimeToPositiveInfoTable1632995635641</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddTimeSlotDayTable1629364845785.html" data-type="entity-link" >AddTimeSlotDayTable1629364845785</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddTimeSlotDTO.html" data-type="entity-link" >AddTimeSlotDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddTimeSlotTable1629364182226.html" data-type="entity-link" >AddTimeSlotTable1629364182226</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddTimezoneToProfile1651485422367.html" data-type="entity-link" >AddTimezoneToProfile1651485422367</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddTimezoneToSlots1651485422366.html" data-type="entity-link" >AddTimezoneToSlots1651485422366</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddTriggerTimeToPositiveInfoTable1633099510340.html" data-type="entity-link" >AddTriggerTimeToPositiveInfoTable1633099510340</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddUnconfirmedEmailTable1626421452168.html" data-type="entity-link" >AddUnconfirmedEmailTable1626421452168</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddUserTable1625563196521.html" data-type="entity-link" >AddUserTable1625563196521</a>
                            </li>
                            <li class="link">
                                <a href="classes/BasicConsumer.html" data-type="entity-link" >BasicConsumer</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryRO.html" data-type="entity-link" >CategoryRO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfirmUserEmailDTO.html" data-type="entity-link" >ConfirmUserEmailDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactEntitySubscriber.html" data-type="entity-link" >ContactEntitySubscriber</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactIdRO.html" data-type="entity-link" >ContactIdRO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactRepository.html" data-type="entity-link" >ContactRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactRO.html" data-type="entity-link" >ContactRO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomError.html" data-type="entity-link" >CustomError</a>
                            </li>
                            <li class="link">
                                <a href="classes/Encrypter.html" data-type="entity-link" >Encrypter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorMessageRO.html" data-type="entity-link" >ErrorMessageRO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorRO.html" data-type="entity-link" >ErrorRO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExceptionsFilter.html" data-type="entity-link" >ExceptionsFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExportUserDataDTO.html" data-type="entity-link" >ExportUserDataDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileCategoryRepository.html" data-type="entity-link" >FileCategoryRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileIdRO.html" data-type="entity-link" >FileIdRO</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileRepository.html" data-type="entity-link" >FileRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileRO.html" data-type="entity-link" >FileRO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAccessTokenDTO.html" data-type="entity-link" >GetAccessTokenDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageConsumer.html" data-type="entity-link" >MessageConsumer</a>
                            </li>
                            <li class="link">
                                <a href="classes/MinutesAsNullableInPositiveInfoTable1633500446819.html" data-type="entity-link" >MinutesAsNullableInPositiveInfoTable1633500446819</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotePositiveInfoDTO.html" data-type="entity-link" >NotePositiveInfoDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/PassportStrategy.html" data-type="entity-link" >PassportStrategy</a>
                            </li>
                            <li class="link">
                                <a href="classes/PositiveInfoRepository.html" data-type="entity-link" >PositiveInfoRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileEntitySubscriber.html" data-type="entity-link" >ProfileEntitySubscriber</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileRepository.html" data-type="entity-link" >ProfileRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileRO.html" data-type="entity-link" >ProfileRO</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveAutomatedVoiceCallFromProfile1651485422365.html" data-type="entity-link" >RemoveAutomatedVoiceCallFromProfile1651485422365</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveLocationFromPositiveInfo1651485422345.html" data-type="entity-link" >RemoveLocationFromPositiveInfo1651485422345</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendEmergencyMessageDTO.html" data-type="entity-link" >SendEmergencyMessageDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendSmsDTO.html" data-type="entity-link" >SendSmsDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SuccessRO.html" data-type="entity-link" >SuccessRO</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeSlotDayRepository.html" data-type="entity-link" >TimeSlotDayRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeSlotIdRO.html" data-type="entity-link" >TimeSlotIdRO</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeSlotRepository.html" data-type="entity-link" >TimeSlotRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeSlotRO.html" data-type="entity-link" >TimeSlotRO</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenRO.html" data-type="entity-link" >TokenRO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnconfirmedEmailEntitySubscriber.html" data-type="entity-link" >UnconfirmedEmailEntitySubscriber</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnconfirmedEmailRepository.html" data-type="entity-link" >UnconfirmedEmailRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateContactAndCheckPhoneDTO.html" data-type="entity-link" >UpdateContactAndCheckPhoneDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateContactDTO.html" data-type="entity-link" >UpdateContactDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTimeSlotDTO.html" data-type="entity-link" >UpdateTimeSlotDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDeviceIdDTO.html" data-type="entity-link" >UpdateUserDeviceIdDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserProfileAndCheckPhoneDTO.html" data-type="entity-link" >UpdateUserProfileAndCheckPhoneDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserProfileDTO.html" data-type="entity-link" >UpdateUserProfileDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserEntitySubscriber.html" data-type="entity-link" >UserEntitySubscriber</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRepository.html" data-type="entity-link" >UserRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRO.html" data-type="entity-link" >UserRO</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NumericIdValidationPipe.html" data-type="entity-link" >NumericIdValidationPipe</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ValidationPipe.html" data-type="entity-link" >ValidationPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/File.html" data-type="entity-link" >File</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICognito.html" data-type="entity-link" >ICognito</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IContactData.html" data-type="entity-link" >IContactData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProfileData.html" data-type="entity-link" >IProfileData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITimeSlotData.html" data-type="entity-link" >ITimeSlotData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserData.html" data-type="entity-link" >IUserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadResult.html" data-type="entity-link" >UploadResult</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});