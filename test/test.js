<template>
    <div class="pure-g" id="order">
        <div class="pure-u-23-24" id="heading">
            <div class="pure-g">
                <div class="pure-u-1-2">
                    <div class="pure-g">
                        <div class="pure-u-1">
                            <h1>Order Details</h1>
                        </div>
                        <div class="pure-u-1 breadcrumbs">
                            <p>
                                <a href="/admin/orders/list">Order Search</a>
                                <span v-if="orderId"><i class="fa fa-angle-right"></i> #{{ orderId }}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="pure-u-1-2">
                    <div class="pure-g">
                        <div class="pure-u-1" style="text-align: right;">
                            <order-search @success="searchSuccess" :class="['pure-u-md-2-3', 'pure-u-xl-1-2']" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pure-u-23-24 order-section">
            <info></info>
        </div>
        <div class="pure-u-23-24 order-section">
            <addresses></addresses>
        </div>
        <div class="pure-u-23-24 order-section">
            <div class="pure-g">
                <div class="pure-u-1" id="order-tabs">
                    <div class="pure-g">
                        <div class="pure-u-1">
                            <div class="tab-heading">
                                <span class="heading" :class="[currentTab == 'products'       ? 'selected' : '']" @click="currentTab = 'products'">PRODUCTS</span>
                                <span class="heading" :class="[currentTab == 'paymentHistory' ? 'selected' : '']" @click="currentTab = 'paymentHistory'">PAYMENT HISTORY</span>
                                <span class="heading" :class="[currentTab == 'refundHistory'  ? 'selected' : '']" @click="currentTab = 'refundHistory'">REFUND HISTORY</span>
                                <span class="heading" :class="[currentTab == 'communication'  ? 'selected' : '']" @click="currentTab = 'communication'">COMMUNICATION</span>
                                <span class="heading" :class="[currentTab == 'systemNotes'    ? 'selected' : '']" @click="currentTab = 'systemNotes'">SYSTEM NOTES</span>
                                <span class="heading" v-if="canEdit && !admin.restricted" :class="[currentTab == 'giftCards'    ? 'selected' : '']" @click="currentTab = 'giftCards'">GIFT CARDS</span>
                                <span class="heading" v-if="!admin.restricted" :class="[currentTab == 'loyalty' ? 'selected' : '']" @click="currentTab = 'loyalty'">LOYALTY</span>
                                <span class="heading" :class="[currentTab == 'courtesies' ? 'selected' : '']" @click="currentTab = 'courtesies'">COURTESIES</span>
                            </div>
                        </div>
                    </div>
                    <div class="pure-g" style="border-top: 1px solid lightgrey;">
                        <transition name="fade" mode="out-in" :duration="100">
                            <div class="pure-u-1 tab-content">
                                <products id="products" v-show="currentTab === 'products'" key="products" />
                                <payment-history id="paymentHistory" v-show="currentTab === 'paymentHistory'" key="paymentHistory"></payment-history>
                                <communication id="communication"  v-show="currentTab === 'communication'" key="communication"></communication>
                                <refund-history id="refundHistory" v-show="currentTab === 'refundHistory'" key="refundHistory"></refund-history>
                                <system-notes id="systemNotes" v-show="currentTab === 'systemNotes'" key="systemNotes" class="scroll"></system-notes>
                                <gift-cards id="giftCards" v-show="currentTab === 'giftCards' && canEdit && !admin.restricted" key="giftCards" class="scroll"></gift-cards>
                                <loyalty id="loyalty" v-show="currentTab === 'loyalty' && canEdit && !admin.restricted" key="loyalty" class="scroll"></loyalty>
                                <courtesies id="courtesies" v-show="currentTab === 'courtesies'" key="courtesies" class="scroll"></courtesies>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
        <div class="pure-u-23-24 order-section">
            <div class="pure-g">
                <div class="pure-u-2-3">
                    <div class="pure-g" v-if="!admin.restricted">
                        <payment-transaction id="paymentTransaction"></payment-transaction>
                    </div>
                </div>
                <div class="pure-u-1-3">
                    <div class="pure-g">
                        <totals></totals>
                    </div>
                </div>
            </div>
        </div>
        <div id="order-buttons" class="pure-u-23-24 order-section">
            <div class="pure-g">
                <div class="pure-u-1-2">
                    <transition name="fade" mode="out-in" :duration="100">
                        <span class="button-inline">
                            <button class="pure-button pure-button-primary" :disabled="!canEdit" @click="settings.editMode = true" v-if="!settings.editMode">
                                <span class="fa fa-edit"></span>
                                <span v-tooltip.hover.top="{content: 'Cannot Edit Closed Orders', visible: closedOrder}">Edit</span>
                            </button>
                            <div class="button-group" v-else>
                                <button class="pure-button pure-button-primary" :disabled="!canSave" @click="save">
                                    <span class="fa fa-save"></span>
                                    <span>Save</span>
                                </button>
                                <button class="pure-button pure-button-primary fa fa-cog" :disabled="!canSave" v-tooltip.notrigger.top="{html: 'saveOptionsContent', visible: saveOptionsShow, class: 'lulus-tooltip translucent'}" @click="saveOptionsShow = !saveOptionsShow"></button>

                                <!-- tooltip content -->
                                <div class="pure-g" id="saveOptionsContent">
                                    <div class="pure-u-1">
                                        <label><input type="checkbox" v-model="saveOptions.forceSalesInvoice" :disabled="!canSave || !this.admin.perm.orders_force_salesinvoice" /> Force New SalesInvoice</label>
                                    </div>
                                </div>
                            </div>
                            <button class="pure-button pure-button-error" @click="checkChanged" v-if="settings.editMode">
                                <span class="fa fa-ban"></span>
                                <span>Cancel</span>
                            </button>
                        </span>
                    </transition>
                </div>
                <div class="pure-u-1-2">
                    <span v-if="orderId">
                        <button type="button" class="pure-button pure-xxsmall" @click="toggleOmsSuperBatcherStatus(0)" v-if="admin.perm.oms_batch && info.oms_process_in_super_batcher">
                            Return To OMS Workflow
                        </button>
                        <button type="button" class="pure-button pure-xxsmall" @click="toggleOmsSuperBatcherStatus(1)" v-if="admin.perm.oms_batch && !info.oms_process_in_super_batcher">
                            Bypass OMS Workflow
                        </button>
                        <a :href="`/admin/express_packer.php`">
                            <button class="pure-button pure-xxsmall" :disabled="closedOrder">Open Packer Tool</button>
                        </a>
                        <a :href="`/admin/orders_labels.php?id_order=${orderId}`">
                            <button class="pure-button pure-xxsmall" :disabled="closedOrder">Manage Labels</button>
                        </a>
                        <a :href="`/admin/orders_invoice.php?id_order=${orderId}`" target="_blank" v-if="!admin.restricted">
                            <button class="pure-button pure-xxsmall">Invoice</button>
                        </a>
                    </span>
                </div>
            </div>
        </div>

        <sweet-modal ref="requireSaveModal" overlay-theme="dark" blocking hide-close-button>
            <div slot="title" class="pure-g">
                <div class="pure-u-1"><i class="fa fa-exclamation-circle"></i> Uh oh!</div>
            </div>

            <div class="pure-g">
                <div class="pure-u-1 center">
                    Shipping address and product changes require a save to finalize order calculations before processing payments, continue?
                </div>
            </div>

            <div slot="button" class="pure-g">
                <div class="pure-u-1">
                    <button class="pure-button" @click="requireSaveModalResponse(false)">Cancel</button>
                    <button class="pure-button-primary pure-button" @click="requireSaveModalResponse(true)">Proceed</button>
                </div>
            </div>
        </sweet-modal>

        <cancel-confirm-modal
            :modalRef="`shipAddressOverride`"
            :message="`Customer requested no change to shipping address.\nAre you sure you want to save the changes in shipping address?`"
            :yesText="`Confirm`"
            noText=""
            :cancelText="`Cancel`"
            :confirmChangeText="`I acknowledge that the changes to the shipping address was approved by the customer.`"
            @response="overrideShippingAddress"
        >
        </cancel-confirm-modal>
        <cancel-confirm-modal @response="handleCancelResponse"/>
    </div>
</template>

<script>
    import Vue from 'vue'
    import API from 'api'
    import { EventBus, errorBanner } from 'eventBus'
    import { diff } from 'jsondiffpatch'
    import { SweetModal } from 'sweet-modal-vue'
    import { Decimal } from 'decimal.js-light'
    import Tooltip from 'vue-directive-tooltip'
    import { DateTime } from 'luxon'
    import { Orders } from 'common/resources/orders'
    import { Promotions } from 'common/resources/promotions'
    import { quote } from 'pages/orders/details/mixins/quote'
    import { orderState } from 'pages/orders/details/mixins/orderState'
    import { productsStateHandler } from 'pages/orders/details/mixins/productsStateHandler'

    import VueInfo from 'pages/orders/details/components/Info.vue'
    import VueAddresses from 'pages/orders/details/components/Addresses.vue'
    import VueProducts from 'pages/orders/details/components/Products.vue'
    import VuePaymentHistory from 'pages/orders/details/components/PaymentHistory.vue'
    import VueCommunication from 'pages/orders/details/components/Communication.vue'
    import VueRefundHistory from 'pages/orders/details/components/RefundHistory.vue'
    import VuePaymentTransaction from 'pages/orders/details/components/PaymentTransaction.vue'
    import VueSystemNotes from 'pages/orders/details/components/SystemNotes.vue'
    import VueGiftCards from 'pages/orders/details/components/GiftCards.vue'
    import VueLoyalty from 'pages/orders/details/components/Loyalty.vue'
    import VueTotals from 'pages/orders/details/components/Totals.vue'
    import VueOrderSearch from 'common/components/Input/OrderSearch.vue'
    import CancelConfirmModal from 'common/components/Modal/CancelConfirm.vue'
    import Courtesies from 'common/components/Layout/Courtesies.vue'

    export default {
        components: {
            info: VueInfo,
            addresses: VueAddresses,
            products: VueProducts,
            paymentHistory: VuePaymentHistory,
            communication: VueCommunication,
            refundHistory: VueRefundHistory,
            paymentTransaction: VuePaymentTransaction,
            systemNotes: VueSystemNotes,
            giftCards: VueGiftCards,
            loyalty: VueLoyalty,
            totals: VueTotals,
            SweetModal,
            OrderSearch: VueOrderSearch,
            CancelConfirmModal,
            Courtesies
        },

        data: () => ({
            orderProcessing: false,
            currentTab: 'products',
            watcherTimeouts: {
                products: null,
                payments: null,
                addresses: null,
                coupon: null,
                totals: null,
                info: null
            },
            shippingAddressChanged: false,
            productsChanged: false,
            paymentsChanged: false,
            refundsChanged: false,
            addressChanged: false,
            infoChanged: false,
            totalsChanged: false,
            saveOptionsShow: false,
            saveOptions: {
                forceSalesInvoice: false
            },
            checkOnly: false, // for debugging
            confirmOverride: false
        }),

        store: [
            'settings',
            'errors',
            'admin',
            'orderId',
            'customerId',
            'addresses',
            'customer',
            'info',
            'infoOld',
            'statuses',
            'totals',
            'totalsOld',
            'totalsDefault',
            'coupon',
            'couponDefault',
            'products',
            'productsOld',
            'paymentRequests',
            'paymentAllowed',
            'olcRequests',
            'returns',
            'updateCustomer',
            'shipments',
            'payments',
            'manualPayment',
            'paymentsOld',
            'refunds',
            'manualRefund',
            'refundsOld',
            'taxes',
            'orderTags',
            'customerTags',
            'promises',
            'quote',
            'productTags',
            'productStatuses',
            'promotion',
            'olcBonus'
        ],

        computed: {
            canEdit () {
                if (this.closedOrder) {
                    return false
                } else {
                    return (Object.keys(this.admin.perm).length) ? this.admin.perm.edit_order : false
                }
            },
            canSave () {
                return !this.orderProcessing
            },
            editShipping () {
                // Only allow cs/refunding/dev role to override shipping
                return [ 'Customer Service', 'Refunding', 'Web Development' ].includes(this.admin.info.department)
            }
        },

        mixins: [ quote, orderState, productsStateHandler ],

        // run on mount
        created () {
            // keep track of the default totals values, should any OT row need to be reverted
            this.totalsDefault = JSON.parse(JSON.stringify(this.totals))
            this.couponDefault = JSON.parse(JSON.stringify(this.coupon))

            if (this.orderId) {
                API.get('/admin/api/orders/', {
                    params: {
                        orderId: this.orderId,
                        resources: ['addresses', 'info', 'totals', 'coupon', 'returns', 'payments', 'refunds', 'taxes', 'promotion', 'olcBonus']
                    }
                })
                .then( (response) => {
                    console.log(response);
                    this.info = Object.assign(this.info, response.data.info) // shallow merge init values

                    this.explodeTags(response.data.info.tags)

                    this.payments  = response.data.payments
                    this.refunds   = response.data.refunds
                    this.coupon    = response.data.coupon
                    this.returns   = response.data.returns
                    this.taxes     = response.data.taxes
                    this.promotion = response.data.promotion
                    this.olcBonus  = response.data.olcBonus
                    this.customerId = this.info.customers_id

                    // deep merge response data with init totals data
                    response.data.totals.forEach(data => {
                        data.value = parseFloat(data.value).toFixed(2)
                        let total = this.totals.find(total => total.class === data.class)
                        if (total) {
                            Object.assign(total, data)
                        } else {
                            this.totals.push(data)
                        }
                    })

                    // deep merge response data with init address data
                    Object.keys(response.data.addresses).forEach(data => {
                        Object.assign(this.addresses[data], response.data.addresses[data])
                    })

                    // convert blank address items to null (our db is dumb)
                    this.nullIfBlank()

                    API.get('/admin/api/customers/', {
                        params: {
                            customerId: this.info.customers_id,
                            countOnly: true,
                            resources: ['info']
                        }
                    })
                    .then( (response) => {
                        Object.keys(response.data.info).forEach(data => {
                            Vue.set(this.customer, data, response.data.info[data])
                        })

                        this.setStartValues()
                    })
                    .catch( (error) => {
                        console.error('Mount:', error)
                        errorBanner('Unable to fetch the data. Try to reload the page')
                    })
                })
                .catch( (error) => {
                    console.error('Mount:', error)
                    errorBanner('Unable to fetch the data. Try to reload the page')
                })
            } else {
                // new order, set up some things manually
                this.info.status = "16" // Pending Payment Authorization
                this.settings.editMode = true // preset to edit mode on new

                this.explodeTags(0)

                this.$store.promises.featureFlags.then( () => {
                    if (this.admin.feature.bxgy_enabled) {
                        Promotions.getAdminActives()
                        .then(promotions => {
                            // at the moment only one promotion going to be applicable
                            // in the future list of promotions will be stored for user to select from
                            this.promotion = Object.values(promotions)[0]
                            this.info.tagsBit = this.orderTags.promo
                            this.info.tags[this.orderTags.promo] = true
                        })
                        .catch(error => {
                            console.error(error)
                            errorBanner('Failed to load promotions (server error)')
                        })
                    }

                    this.setStartValues()
                })
            }

            // pull permissions
            API.get('/admin/api/employees/', {
                params: {
                    resources: ['permissions', 'building', 'info'],
                    permissions: [
                        'needs_attention', 'edit_order', 'batcher_administrator', 'refund', 'etna_shipment',
                        'building_override', 'orders_force_salesinvoice', 'orders_nocharge', 'orders_hold',
                        'orders_klarna', 'orders_closed', 'courtesy_level2', 'oms_batch'
                    ]
                }
            })
            .then( (response) => {
                this.admin.perm = response.data.permissions

                this.admin.building = response.data.building

                if (this.admin.building === 'Pennsylvania') {
                    this.admin.restricted = !this.admin.perm.building_override
                }

                this.admin.info = response.data.info
            })
            .catch( (error) => {
                console.error('Mount:', error)
                errorBanner('Unable to load admin data (server error)')
            })

            // support direct link to tabs via hashtag
            // TODO: support in UI (either through custom right click contextmenu, or rollover link icon to copy link with hashtag)
            let hash = window.location.hash.substr(1)
            let tabs = ['products', 'paymentHistory', 'refundHistory', 'communication', 'systemNotes', 'giftCards', 'loyalty', 'courtesies']

            if (hash && tabs.includes(hash)) {
                this.currentTab = hash
            }
        },

        methods: {
            setStartValues () {
                this.info.notices = {}
                this.info.shipping_method = this.totals.find(total => total.class === 'ot_shipping')
                this.info.shipping_method.title = `${this.info.shipping_method.title_alias}:`
                this.info.shipping_method.text  = `${this.info.shipping_method.value}:`

                this.totals
                    .map(total => {
                        total.value = parseFloat(total.value).toFixed(2)
                        return total
                    })
                    .filter(total  => total.class === 'ot_custom')
                    .forEach(total => {
                        // add 'delete' key; use Vue.set because it cannot watch newly-created keys
                        Vue.set(total, 'delete', false)
                    })

                this.products.map(product => {
                    product.coupon_savings_ea = parseFloat(product.coupon_savings_ea).toFixed(2)
                    return product
                })

                var shipmentList  = [ '3 Business Days', '2 Business Days', '1 Business Day', 'Express Shipping', 'Expedited', 'Expedited Shipping', 'Priority Shipping' ]
                var orderNotices  = []

                this.applyFreeShipping()

                // cast stringed integers to int
                this.info.needs_attention = +this.info.needs_attention
                this.info.suspicious_hold = +this.info.suspicious_hold
                this.info.status          = +this.info.status

                if (this.info.needs_signature != null ) {
                    this.info.needs_signature = +this.info.needs_signature
                }

                if (this.info.suspicious_hold) { orderNotices.push('Suspicious Hold in Effect') }

                if (orderNotices.length) {
                    this.info.notices.order = orderNotices.join(' *** ')
                }

                if (this.info.needs_attention) {
                    this.info.notices.other = 'Needs Attention'
                }

                if (this.info.shipping_method && shipmentList.includes(this.info.shipping_method.title_alias)) {
                    this.info.notices.shipping = 'Expedited Order'
                }

                if (+this.customer.fraud_screen) {
                    this.info.notices.fraud = 'FRAUD'
                }

                if (this.customer.enabled === '0') {
                    this.info.notices.gdpr = 'Customer Under GDPR Data Restrictions'
                }

                if (this.info.unfinished_refund) {
                    this.info.notices.refund = 'Unfinished Refund'
                }

                if (this.addresses.delivery.country &&
                    (this.addresses.delivery.country !== 'United States' || this.addresses.delivery.country_id !== "223")) {
                    this.info.notices.international = 'International Order'
                }

                this.infoOld      = JSON.parse(JSON.stringify(this.info))
                this.addressesOld = JSON.parse(JSON.stringify(this.addresses))
                this.totalsOld    = JSON.parse(JSON.stringify(this.totals))
                this.productsOld  = JSON.parse(JSON.stringify(this.products))
                this.paymentsOld  = JSON.parse(JSON.stringify(this.payments))
                this.refundsOld   = JSON.parse(JSON.stringify(this.refunds))
            },
            checkChanged () {
                if (this.productsChanged || this.addressChanged || this.infoChanged || this.paymentsChanged ||
                    this.refundsChanged || this.totalsChanged || this.paymentRequests.length || this.olcRequests.length) {

                    EventBus.$emit('cancelConfirm')
                } else {
                    this.resetChanges()
                }
            },
            resetChanges () {
                if (this.orderId) {
                    this.products  = JSON.parse(JSON.stringify(this.productsOld))
                    this.payments  = JSON.parse(JSON.stringify(this.paymentsOld))
                    this.refunds   = JSON.parse(JSON.stringify(this.refundsOld))
                    this.addresses = JSON.parse(JSON.stringify(this.addressesOld))
                    this.info      = JSON.parse(JSON.stringify(this.infoOld))
                } else {
                    this.products  = []
                    this.addresses = {
                        billing:  {},
                        customer: {},
                        delivery: {}
                    }
                    this.info      = {}
                }
                this.totals = JSON.parse(JSON.stringify(this.totalsOld))

                this.paymentRequests = []
                this.olcRequests     = []
                this.manualPayment.amount = 0
                this.manualRefund.amount  = 0

                this.settings.editMode = false
            },
            handleCancelResponse (response) {
                switch (response) {
                    case 'proceed':
                        this.resetChanges()
                        break
                    case 'save':
                        this.save()
                        break
                    default:
                        break
                }
            },
            save () {
                try {
                    if (this.shippingAddressChanged && this.editShipping &&
                        this.info.address_override && !this.info.address_override_confirmed) {
                        EventBus.$emit('cancelConfirm', 'shipAddressOverride')
                        return false
                    }

                    this.orderProcessing = true
                    let productChanges = this.getProductChanges()
                    let totalsChanges  = this.getTotalsChanges()

                    productChanges = (productChanges.length) ? productChanges : undefined
                    totalsChanges  = (totalsChanges.length) ? totalsChanges : undefined
                    let paymentRequests = (this.paymentRequests.length) ? this.paymentRequests : undefined
                    let olcRequests     = (this.olcRequests.length) ? this.olcRequests : undefined

                    let manualPayment   = (this.manualPayment.amount) ? this.manualPayment : undefined
                    let deletePayments = []
                    if (this.payments) {
                        this.payments.forEach(function(payment){
                            if (payment.delete == 1) {
                                deletePayments.push(payment)
                            }
                        })
                    }

                    let manualRefund = (this.manualRefund.amount) ? this.manualRefund : undefined
                    let deleteRefunds = []
                    if (this.refunds) {
                        this.refunds.forEach(function(refund){
                            if (refund.delete == 1) {
                                deleteRefunds.push(refund)
                            }
                        })
                    }

                    // since info and addresses are pointing to two different objects
                    this.info.customers_name      = this.addresses.customer.name
                    this.info.customers_telephone = this.addresses.customer.telephone

                    let voidShipLabels = (+this.info.active_label_count && (this.shippingAddressChanged || this.infoChanged.shipping_method)) ? true : false

                    // apply hold when item added or shipping addy changed
                    if (this.admin.feature.approve_nocharge) {
                        if ((this.info.tags && this.info.tags[this.orderTags.nocharge] && !this.info.tags[this.orderTags.hold]) &&
                            ((productChanges && productChanges.some(p => +p.orderProductId == 0)) || this.shippingAddressChanged)) {
                            this.info.tags[this.orderTags.hold] = true
                        }
                    }

                    // when its a new customer
                    if (!this.info.customers_id) {
                        this.updateCustomer = true
                    }

                    API.post('/admin/api/orders/', {
                        orderId:          this.orderId,
                        info:             this.info,
                        addresses:        this.addresses,
                        coupon:           this.coupon,
                        productChanges,
                        paymentRequests:  paymentRequests,
                        olcRequests:      olcRequests,
                        checkOnly:        this.checkOnly,
                        totals:           totalsChanges,
                        voidShipLabels,
                        updateCustomer:   this.updateCustomer,
                        shippingAddressChanges: this.shippingAddressChanged,
                        manualPayment:    manualPayment,
                        deletePayments:   deletePayments,
                        manualRefund:     manualRefund,
                        deleteRefunds:    deleteRefunds,
                        options:          this.saveOptions,
                        promotion:        this.promotion
                    })
                    .then( (response) => {
                        console.log(response);
                        this.orderProcessing = false
                        let message = ''
                        let data = response.data

                        // reset the Update Customer Record checkbox
                        this.updateCustomer = false

                        if (data.saveType == 'created') {
                            this.orderId    = data.id
                            this.customerId = data.customerId
                            window.history.pushState('', '', `?orderId=${data.id}`)
                        }

                        if (data.labels) {
                            EventBus.$emit('labels', data.labels)
                            message = 'Active labels invalidated.'
                        }

                        if (data.comments) {
                            data.comments.forEach (comment => {
                                EventBus.$emit('newComment', comment)
                            })
                        }

                        EventBus.$emit('stickyBanner', {
                            message: `Successfully ${data.saveType} order. ${message}`,
                            timer: '30s'
                        })

                        if (data.payments) {
                            this.payments = data.payments
                        }

                        if (data.refunds) {
                            this.refunds = data.refunds
                        }

                        // done editing
                        this.settings.editMode = false

                        // if check only, nothing was saved so end here
                        if (this.checkOnly) {
                            return
                        }
                        this.coupon   = data.coupon
                        this.products = data.products
                        this.shipments = data.shipments
                        this.customer = data.customerInfo
                        this.taxes    = data.taxes
                        this.info     = Object.assign(this.info, data.info)
                        this.olcBonus = data.olcBonus

                        this.info.tags    = {}
                        this.info.tagsBit = response.data.info.tags

                        // set up tags individually for check boxes
                        Object.values(this.orderTags).forEach( bit => {
                            Vue.set(this.info.tags, bit, !!(+this.info.tagsBit & bit))
                        })

                        // first remove all deleted fees from the totals array
                        this.totals.map(total => {
                            if (total.delete || total.value == 0) {
                                delete total.orders_total_id

                                let totalDefault = this.totalsDefault.filter(p => p.class === total.class)[0]

                                total.value  = totalDefault.value
                                total.title  = totalDefault.title
                                total.delete = false

                                if (total.class === 'ot_coupon') {
                                    this.coupon = JSON.parse(JSON.stringify(this.couponDefault))
                                }
                            }
                            return total
                        })

                        // deep merge response data with init totals data
                        data.totals.forEach(data => {
                            let total = this.totals.find(total => total.class === data.class)
                            if (total) {
                                Object.assign(total, data)
                            } else {
                                this.totals.push(data)
                            }
                        })

                        this.setStartValues()

                        this.shippingAddressChanged = false
                        this.addressChanged         = false

                        if (data.paymentRequests && data.paymentRequests.length) {
                            data.paymentRequests.forEach((result, i) => {
                                switch (result.status) {
                                    case 'approved':
                                        EventBus.$emit('newTransaction', result.transaction)
                                        EventBus.$emit('newComment', result.comment)
                                        break

                                    default:
                                        let amount = this.paymentRequests[i].amount

                                        let lines = [
                                            'Payment transaction failed!',
                                            `For sale of ${Vue.options.filters.currency(amount)}`
                                        ]

                                        if (result.code) {
                                            lines.push(`Code: ${result.code}`)
                                        }
                                        if (result.message) {
                                            lines.push(`Message: ${result.message}`)
                                        }

                                        EventBus.$emit('alert', lines.join('<br>'))
                                        break
                                }
                            })
                        }
                        if (data.olcRequests && data.olcRequests.length) {
                            data.olcRequests.forEach((result, i) => {
                                let requested = this.olcRequests[i]

                                switch (result.status) {
                                    case 'approved':
                                        EventBus.$emit('newComment', result.comment)

                                        if (requested.type === 'payment') {
                                            EventBus.$emit('newTransaction', result.transaction)
                                        } else {
                                            result.refunds.forEach(refund => EventBus.$emit('newRefund', refund))
                                        }

                                        break

                                    default:
                                        let amount = this.olcRequests[i].amount

                                        let lines = [
                                            'Store Credit transaction failed!',
                                            `For ${requested.type} of ${Vue.options.filters.currency(amount)}`
                                        ]

                                        if (result.message) {
                                            lines.push(`Message: ${result.message}`)
                                        }

                                        EventBus.$emit('alert', lines.join('<br>'))
                                        break
                                }
                            })
                        }

                        this.paymentRequests = []
                        this.olcRequests     = []
                        this.manualPayment.amount = 0
                        this.manualRefund.amount  = 0
                    })
                    .catch( (error) => {
                        this.orderProcessing = false

                        if (!error.response || !error.response.data) return

                        let data = error.response.data

                        if (data && data.errors.length) {
                            this.errors = data.errors

                            // get list of error messages unrelated to inputs
                            let errorMessage = this.errors
                                .filter(error => !error.param)
                                .reduce((str, error) => `${str}${error.message}\n`, '')

                            if (errorMessage) {
                                EventBus.$emit('alert', errorMessage)
                            }
                        } else {
                            console.error('Save Order:', error)
                            errorBanner('Unable to process request (server error)')
                        }
                    })
                } catch (x) {
                    this.orderProcessing = false
                    console.error('Save Order:', x)
                    errorBanner('Unable to process request (server error)')
                }
            },
            // sort of a psuedo computed var, since PaymentTransaction.vue needs to see this
            setPaymentAllowed () {
                this.paymentAllowed = !(this.shippingAddressChanged || this.productsChanged || this.totalsChanged)

                // if payment not allowed, zero out payment/olc requests
                if (!this.paymentAllowed && (this.paymentRequests.length || this.olcRequests.length)) {
                    this.$refs.requireSaveModal.open()
                }
            },
            requireSaveModalResponse (proceed) {
                if (proceed) {
                    this.paymentRequests = []
                    this.olcRequests     = []

                    this.$refs.requireSaveModal.close()
                } else {
                    this.addresses.delivery = Object.assign({}, this.addressesOld.delivery)
                    this.products = JSON.parse( JSON.stringify( this.productsOld ) )
                    this.payments = JSON.parse( JSON.stringify( this.paymentsOld ) )
                    this.refunds  = JSON.parse( JSON.stringify( this.refundsOld ) )

                    this.$refs.requireSaveModal.close()
                }
            },
            overrideShippingAddress (response) {
                if (response === 'proceed') {
                    this.info.address_override_confirmed = true
                    this.save()
                } else if (response === 'cancel') {
                    this.info.address_override_confirmed = false
                    this.addresses.delivery = JSON.parse(JSON.stringify(this.addressesOld.delivery))
                }
            },
            nullIfBlank () {
                for (let item in this.addresses) {
                    Object.keys(this.addresses[item]).map( value => {
                        if (this.addresses[item][value] === "") {
                            this.addresses[item][value] = null
                        }
                    })
                }
            },
            searchSuccess (id) {
                if (id !== this.orderId) {
                    location.href = `/admin/orders/details/?orderId=${id}`
                }
            },
            getProductChanges () {
                let productChanges = []

                let selectChangable = product => ({
                    name:        product.name,
                    model:       product.model,
                    weight:      product.weight,
                    tax:         product.tax,
                    tags:        +product.tags,
                    base_price:  product.base_price,
                    final_price: +product.final_price,
                    quantity:    +product.quantity,
                    sku_id:      +product.sku_id,
                    size_id:     +product.size_id,
                    coupon_savings_ea: new Decimal(product.coupon_savings_ea).toFixed(2)
                })

                let productDiffs = diff(
                    this.productsOld.map(selectChangable),
                    this.products.map(selectChangable)
                )

                for (let i in productDiffs) {
                    if (i === '_t') {
                        continue
                    }

                    let product = this.products[i]
                    let sizeChanged = false

                    let productDiff = productDiffs[i]


                    if (Object(productDiff).hasOwnProperty('size_id')) {
                        sizeChanged = true
                    }

                    let quantityAdded = 0
                    // newly added products will be encoded as an array of those items
                    // modified products will be encoded as an object with changes as properties
                    if (Array.isArray(productDiff)) {
                        quantityAdded = +productDiff[0].quantity
                    } else {
                        let quantityDiff = productDiff.quantity
                        // make sure to check if the quantity was changed for this modified product
                        quantityAdded = quantityDiff ? quantityDiff[1] - quantityDiff[0] : 0
                        quantityAdded = (quantityAdded < 0) ? quantityAdded : (sizeChanged ? quantityAdded + 1 : quantityAdded)
                    }

                    let coalesceDiff = (prop) => productDiff[prop] ? productDiff[prop][1] : product[prop]

                    productChanges.push({
                        productId:           product.products_id,
                        orderProductId:      product.orders_products_id && +product.orders_products_id,
                        fulfillment_status:  product.fulfillment_status,
                        size_alias:          product.size_alias,
                        tags:                product.tags,
                        skuId:               product.sku_id,
                        metadata:            product.metadata,
                        name:                coalesceDiff('name'),
                        model:               coalesceDiff('model'),
                        weight:              coalesceDiff('weight'),
                        tax:                 coalesceDiff('tax'),
                        base_price:          coalesceDiff('base_price'),
                        final_price:         coalesceDiff('final_price'),
                        coupon_savings_ea:   coalesceDiff('coupon_savings_ea'),
                        quantityAdded,
                        sizeChanged
                    })
                }

                return productChanges
            },
            getTotalsChanges () {
                // only send total rows that have changed
                let totalsChanges = []
                let totalsChangableClasses = ['ot_customer_discount', 'ot_custom', 'ot_shipping', 'ot_return_shipping', 'ot_gv', 'ot_coupon', 'ot_address_intercept']
                let totalsChangableColumns = row => ({
                    title: row.title,
                    value: row.value,
                    delete: row.delete
                })

                let totalsDiff = diff(
                    this.totalsOld.map(totalsChangableColumns),
                    this.totals.map(totalsChangableColumns)
                ) || false

                for (let i in totalsDiff) {
                    // skip jsondiffpatch's type indicator
                    if (i == '_t') {
                        continue
                    }

                    if (totalsChangableClasses.includes(this.totals[i].class)) {
                        totalsChanges.push(this.totals[i])
                    }
                }

                return totalsChanges
            },
            toggleOmsSuperBatcherStatus (status = 0) {
                API.post('/admin/api/orders/', {
                    resources: {
                        omsToggleStatus: status
                    }
                })
                .then( (response) =>
                    console.log(response);
                );
            }
        },

        watch: {
            products: {
                handler: function () {
                    clearTimeout(this.watcherTimeouts.products)

                    this.watcherTimeouts.products = setTimeout( ( () => {
                        // check for product changes
                        let selectChangable = product => ({
                            name:        product.name,
                            tags:        +product.tags,
                            model:       product.model,
                            size_id:     +product.size_id,
                            quantity:    +product.quantity,
                            final_price: +product.final_price,
                            coupon_savings_ea: new Decimal(product.coupon_savings_ea).toFixed(2)
                        })

                        let productChanges = diff(
                            this.productsOld.map(selectChangable),
                            this.products.map(selectChangable)
                        ) || false

                        this.productsChanged = (productChanges)
                        if (this.productsChanged) {
                            this.updateQuote()
                        }

                        this.setPaymentAllowed()
                    }), this.settings.defaultTimeout)
                },
                deep: true
            },
            totals: {
                handler: function () {
                    clearTimeout(this.watcherTimeouts.totals)

                    this.watcherTimeouts.totals = setTimeout( ( () => {
                        // determine what eligible totals rows have changed
                        let totalsChangableClasses = ['ot_customer_discount', 'ot_custom', 'ot_shipping', 'ot_return_shipping', 'ot_coupon', 'ot_address_intercept']
                        let totalsChangableColumns = row => ({
                            title: row.title,
                            value: row.value,
                            delete: row.delete
                        })

                        this.totalsChanged = diff(
                            this.totalsOld
                                .filter(row => totalsChangableClasses.includes(row.class))
                                .map(totalsChangableColumns),
                            this.totals
                                .filter(row => totalsChangableClasses.includes(row.class))
                                .map(totalsChangableColumns)
                        ) || false

                        this.setPaymentAllowed()
                    }), this.settings.defaultTimeout)
                },
                deep: true
            },
            addresses: {
                handler: function () {
                    clearTimeout(this.watcherTimeouts.addresses)

                    this.watcherTimeouts.addresses = setTimeout( ( () => {
                        this.nullIfBlank()

                        let addressChanges = diff(
                            this.addressesOld,
                            this.addresses
                        ) || false

                        this.addressChanged = (addressChanges)

                        this.shippingAddressChanged = (addressChanges && addressChanges.delivery)
                        for (let field of ['street_address', 'suburb', 'city', 'state', 'country', 'postcode', 'format_id']) {
                            if (Object(this.shippingAddressChanged).hasOwnProperty(field)) {
                                this.updateQuote()
                                break
                            }
                        }

                        this.setPaymentAllowed()
                    }), this.settings.defaultTimeout)
                },
                deep: true
            },
            info: {
                handler: function () {
                    clearTimeout(this.watcherTimeouts.info)

                    this.watcherTimeouts.info = setTimeout( ( () => {
                        this.infoChanged = diff(this.infoOld, this.info) || false
                    }), this.settings.defaultTimeout)
                },
                deep: true
            },
            infoOld: {
                handler: function () {
                    // if infoOld updated, clear infoChanged
                    this.infoChanged = false
                },
                deep: true
            },
            payments: {
                handler: function () {
                    clearTimeout(this.watcherTimeouts.payments)

                    this.watcherTimeouts.payments = setTimeout( ( () => {
                        this.paymentsChanged = diff(this.paymentsOld, this.payments) || false
                    }), this.settings.defaultTimeout)
                },
                deep: true
            },
            refunds: {
                handler: function () {
                    clearTimeout(this.watcherTimeouts.refunds)

                    this.watcherTimeouts.refunds = setTimeout( ( () => {
                        this.refundsChanged = diff(this.refundsOld, this.refunds) || false
                    }), this.settings.defaultTimeout)
                },
                deep: true
            },
            currentTab: function (tab) {
                EventBus.$emit('tabChanged', tab)
            }
        }
    }
</script>

<style src="../styles/details.scss" lang="scss"></style>
