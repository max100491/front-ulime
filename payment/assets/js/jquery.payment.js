/**
 * Payment page universal handler
 */
(function ($) {

    var settings = {
        // name for orderId parameter
        orderIdParam: "mdOrder",
        language: "ru",

        // orderDetails
        orderId: "orderNumber",
        amount: "amount",
        feeAmount: "feeAmount",
        feeChecked: "feeChecked",
        bonusAmount: "bonusAmount",
        bonusBlock: "bonusBlock",
        description: "description",

        paymentFormId: "formPayment",
        acsFormId: "acs",

        panInputId: "iPAN",
        pan1InputId: "pan1",
        pan2InputId: "pan2",
        pan3InputId: "pan3",
        pan4InputId: "pan4",

        paramPrefix: "param.",

        yearSelectId: "year",
        currentYear: (new Date).getFullYear(),
        monthSelectId: "month",
        cardholderInputId: "iTEXT",
        cvcInputId: "iCVC",
        emailInputId: "email",
        bindingCheckBoxId: "createBinding",
        agreementCheckboxId: "iAgree",
        emailId: "email",

        paymentAction: "../../rest/processform.do",
        paymentBindingAction: "../../rest/processBindingForm.do",
        getSessionStatusAction: "../../rest/getSessionStatus.do",
        isMaestroCardAction: "../../rest/isMaestroCard.do",
        showErrorAction: "../../rest/showErrors.do",
        getFeeAction: "../../rest/getFee.do",

        messageAjaxError: "аЁаЕбаВаИб аВбаЕаМаЕаНаНаО аНаЕаДаОбббаПаЕаН. ааОаПбаОаБбаЙбаЕ аПаОаЗаДаНаЕаЕ.",
        messageTimeRemaining: "ааО аОаКаОаНбаАаНаИб баЕббаИаИ аОббаАаЛаОбб #MIN#:#SEC#",
        messageRedirecting: "ааЕбаЕаАаДбаЕбаАбаИб...",
        messageValidationInvalid: "абаОаВаЕбббаЕ аВаВаЕаДбаНаНбаЕ аДаАаНаНбаЕ",

        visualValidationEnabled: false,
        getFeeEnabled: false,
        bindingCheckboxEnabled: false,
        agreementCheckboxEnabled: false,
        emailEnabled: false,
        onReady: function () {
        },

        updatePage: function (data) {
            $("#" + settings.orderId).text(data[settings.orderId]);
            $("#" + settings.amount).text(data[settings.amount]);
            $("#" + settings.description).text(data[settings.description]);
            if (data[settings.bonusAmount] > 0) {
                $("#" + settings.bonusBlock).show();
                $("#" + settings.bonusAmount).text(data[settings.bonusAmount]);
            } else {
                $("#" + settings.bonusBlock).hide();
            }
        }
    };

    var properties = {
        orderId: null,
        expired: false,
        validatePan: false,
        validateExpiry: false,
        validateCardholderName: false,
        validateCvc: false,
        isMaestro: false,
        fee: 0,
        cvcValidationRequired: true,
        validateAgreementCheckbox: false,
        validateEmail: false
    };

    var methods = {
        maestroCheck: {
            pan: "",
            result: false
        },

        init: function (options) {
            if (options) {
                $.extend(settings, options);
            }
            return this.each(function () {
                $(this).ready(methods.fillControls);
                //methods.bindControls();
                // init data
                var orderId = $.url.param(settings.orderIdParam);
                if (!orderId) {
                    orderId = $.url.param(settings.orderIdParamUpperCase);
                    if (!orderId) {
                        $(this).log("Unknown order", "error");
                        return;
                    }
                }
                properties.orderId = orderId;
                properties.expired = false;
                methods.getSessionStatus(true);
            });
        },
        checkControl: function (name) {
            if ($(name).length == 0) {
                alert('Absent ' + name);
            }
        },
        checkControls: function () {
            methods.checkControl('#' + settings.paymentFormId);
            methods.checkControl("#" + settings.panInputId);
            methods.checkControl("#" + settings.cardholderInputId);
            methods.checkControl("#" + settings.cvcInputId);

            methods.checkControl("#" + settings.yearSelectId);
            methods.checkControl("#" + settings.monthSelectId);

            methods.checkControl('#' + settings.orderId);
            methods.checkControl('#' + settings.amount);

            if (settings.bindingCheckboxEnabled) methods.checkControl('#' + settings.bindingCheckBoxId);
            if (settings.agreementCheckboxEnabled) methods.checkControl('#' + settings.agreementCheckboxId);
            if (settings.emailEnabled) methods.checkControl('#' + settings.emailId);

            methods.checkControl('#buttonPayment');
            methods.checkControl('#mdOrder');
            methods.checkControl('#location');
            methods.checkControl('#expiry');
            methods.checkControl('#language');
            methods.checkControl('#errorBlock');
            methods.checkControl('#numberCountdown');
            methods.checkControl('#infoBlock');
        },
        bindControls: function () {
            methods.checkControls();
            $('#' + settings.paymentFormId).bind('submit.payment', methods.onSubmit);
            if (settings.visualValidationEnabled) {
                $("#" + settings.panInputId).bind('keyup.payment', methods.validatePan);
                $("#" + settings.panInputId).bind('keyup.payment', methods.getFee);
                $("#" + settings.cardholderInputId).bind('keyup.payment', methods.validateCardholderName);
                $("#" + settings.cvcInputId).bind('keyup.payment', methods.validateCvc);
                $("#" + settings.emailId).bind('keyup.payment', methods.validateEmail);

                $("#" + settings.yearSelectId).bind('change.payment', methods.validateExpiry);
                $("#" + settings.monthSelectId).bind('change.payment', methods.validateExpiry);
            } else {
                $("#" + settings.panInputId).bind('keyup.payment', methods.validate);
                $("#" + settings.cardholderInputId).bind('keyup.payment', methods.validate);
                $("#" + settings.cvcInputId).bind('keyup.payment', methods.validate);
                $("#" + settings.emailId).bind('keyup.payment', methods.validate);

                $("#" + settings.yearSelectId).bind('change.payment', methods.validate);
                $("#" + settings.monthSelectId).bind('change.payment', methods.validate);
            }
            $('#' + settings.panInputId).bind('keypress.payment', methods.checkNumberInput);
            $('#' + settings.pan1InputId).bind('keypress.payment', methods.checkNumberInput);
            $('#' + settings.pan1InputId).bind('paste.payment', methods.checkNumberInput);
            $('#' + settings.pan2InputId).bind('keypress.payment', methods.checkNumberInput);
            $('#' + settings.pan2InputId).bind('paste.payment', methods.checkNumberInput);
            $('#' + settings.pan3InputId).bind('keypress.payment', methods.checkNumberInput);
            $('#' + settings.pan3InputId).bind('paste.payment', methods.checkNumberInput);
            $('#' + settings.pan4InputId).bind('keypress.payment', methods.checkNumberInput);
            $('#' + settings.pan4InputId).bind('paste.payment', methods.checkNumberInput);
            $('#' + settings.cvcInputId).bind('keypress.payment', methods.checkNumberInput);
            $('#' + settings.cvcInputId).bind('paste.payment', methods.checkNumberInput);
            $('#' + settings.cardholderInputId).bind('keypress.payment', methods.checkNameInput);
            $('#' + settings.cardholderInputId).bind('paste.payment', methods.checkNameInput);

            $('#buttonPayment').bind('click.payment', methods.doSubmitForm);
            $('#buttonPaymentAlfa').bind('click.payment', methods.doSubmitFormAlfa);
            $('#buttonPaymentUpop').bind('click.payment', methods.doSubmitFormUpop);

            if (settings.agreementCheckboxEnabled) {
                $('#' + settings.agreementCheckboxId).change(methods.validate);
            }
        },
        fillControls: function () {
            methods.bindControls();
            $('#' + settings.yearSelectId).empty();
            var year = settings.currentYear;
            while (year < settings.currentYear + 20) {
                var option = "<option value=" + year + ">" + year + "</option>";
                $('#' + settings.yearSelectId).append($(option));
                year++;
            }
        },
        checkNumberInput: function (event) {
            setTimeout(function () {
                var elem = $(event.target);
                elem.val(elem.val().replace(/\D/g, ""));
            }, 0);
        },
        checkNameInput: function (event) {
            setTimeout(function () {
                var elem = $(event.target);
                elem.val(elem.val().replace(/[^a-zA-Z ' \-`.]/g, ""));
            }, 0);
        },
        onSubmit: function (event) {
            event.preventDefault();
            methods.sendPayment();
        },
        switchActions: function (isEnabled) {
            $('#buttonPayment').attr('disabled', !isEnabled);
        },
        switchBindingsActions: function (isEnabled) {
            $('#buttonBindingPayment').attr('disabled', !isEnabled);
        },
        doSubmitForm: function () {
            if (!methods.validate()) {
//                if (settings.visualValidationEnabled) {
//                    methods.showError(settings.messageValidationInvalid);
//                }
                return;
            }
            if (settings.getFeeEnabled && properties.fee > 0 && !$("#" + settings.feeChecked).val()) {
                return;
            }
            $('#expiry').val($("#" + settings.yearSelectId).val() + $("#" + settings.monthSelectId).val());
            methods.switchActions(false);
            $('#formPayment').submit();
        },
        doSubmitFormAlfa: function () {
            methods.sendPaymentAlfa();
        },
        doSubmitFormUpop: function () {
            methods.sendPaymentUpop();
        },
        validateCardholderName: function () {
            if (!/(\s*\w+\s*((\.|'|-)|\s+|$)){1,}/.test($('#' + settings.cardholderInputId).val())) {
                properties.validateCardholderName = false;
                if (settings.visualValidationEnabled) {
                    $("#" + settings.cardholderInputId).removeClass("valid");
                    $("#" + settings.cardholderInputId).addClass("invalid");
                }
            } else {
                properties.validateCardholderName = true;
                if (settings.visualValidationEnabled) {
                    $("#" + settings.cardholderInputId).removeClass("invalid");
                    $("#" + settings.cardholderInputId).addClass("valid");
                }
            }
        },
        validateAgreementCheckbox: function () {
            if (!settings.agreementCheckboxEnabled || $('#' + settings.agreementCheckboxId).attr("checked")) {
                properties.validateAgreementCheckbox = true;
                $("#" + settings.agreementCheckboxId).removeClass("invalid");
                $("#" + settings.agreementCheckboxId).addClass("valid");
            } else {
                properties.validateAgreementCheckbox = false;
                $("#" + settings.agreementCheckboxId).removeClass("valid");
                $("#" + settings.agreementCheckboxId).addClass("invalid");
            }
        },
        validateExpiry: function () {
            // check if card expiration date
            var dateNow = new Date();
            var cardDate = new Date();
            cardDate.setYear($('#' + settings.yearSelectId).val());
            cardDate.setMonth($('#' + settings.monthSelectId).val() - 1);
            if (dateNow.getTime() > cardDate.getTime() || this.expired) {
                properties.validateExpiry = false;
                if (settings.visualValidationEnabled) {
                    $("#" + settings.yearSelectId).removeClass("valid");
                    $("#" + settings.monthSelectId).removeClass("valid");
                    $("#" + settings.yearSelectId).addClass("invalid");
                    $("#" + settings.monthSelectId).addClass("invalid");

                }
            } else {
                properties.validateExpiry = true;
                if (settings.visualValidationEnabled) {
                    $("#" + settings.yearSelectId).removeClass("invalid");
                    $("#" + settings.monthSelectId).removeClass("invalid");
                    $("#" + settings.yearSelectId).addClass("valid");
                    $("#" + settings.monthSelectId).addClass("valid");
                }
            }
        },
        validatePan: function () {
            function switchPanValidClasses(valid) {
                if (settings.visualValidationEnabled) {
                    classToRemove = valid ? "invalid" : "valid";
                    classToAdd = valid ? "valid" : "invalid";
                    $("#" + settings.panInputId).removeClass(classToRemove);
                    $("#" + settings.pan1InputId).removeClass(classToRemove);
                    $("#" + settings.pan2InputId).removeClass(classToRemove);
                    $("#" + settings.pan3InputId).removeClass(classToRemove);
                    $("#" + settings.pan4InputId).removeClass(classToRemove);
                    $("#" + settings.panInputId).addClass(classToAdd);
                    $("#" + settings.pan1InputId).addClass(classToAdd);
                    $("#" + settings.pan2InputId).addClass(classToAdd);
                    $("#" + settings.pan3InputId).addClass(classToAdd);
                    $("#" + settings.pan4InputId).addClass(classToAdd);
                }
            }

            if (!/^\d{12,19}$/.test($('#' + settings.panInputId).val())) {
                properties.validatePan = false;
                switchPanValidClasses(false);
            } else if (!luhn($('#' + settings.panInputId).val())) {
                properties.validatePan = false;
                switchPanValidClasses(false);
            } else {
                if (properties.validatePan == false && $(document).saveEvent) {
                    $(document).saveEvent("pan_valid", "iPAN")
                }
                properties.validatePan = true;
                switchPanValidClasses(true);
            }


            if (properties.validatePan) {
                if (/^(50|5[6-8]|6[0-9]).*$/.test($('#' + settings.panInputId).val())) {
                    properties.isMaestro = false;
                    properties.isMaestro = methods.isMaestroCard();
                    //if (properties.isMaestro == undefined) { // абаЛ аВбаЗаОаВ AJAX => ббаО аНаЕ submit аИ баЕаЗбаЛббаАб, аВаОаЗаВбаАбаАаЕаМбаЙ validate(), аНаЕ аНбаЖаЕаН, аА аОббаАаВбаАббб аВаАаЛаИаДаАбаИб аВбаПаОаЛаНаИаЛаАбб аВ isMaestroCard().
                    //   properties.isMaestro = false;
                    //}
                }
                methods.validateCvc();
            } else {
                properties.isMaestro = false;
                methods.validateCvc();
            }

        },
        validateCvc: function () {
            $("#cvcMessage").hide();
            if ((properties.isMaestro && $('#' + settings.cvcInputId).val() == "") || properties.cvcValidationRequired == false) {
                $("#cvcMessage").show();
                properties.validateCvc = true;
                if (settings.visualValidationEnabled) {
                    $("#" + settings.cvcInputId).removeClass("invalid");
                    $("#" + settings.cvcInputId).addClass("valid");
                }
            } else if (!/^\d{3,4}$/.test($('#' + settings.cvcInputId).val())) {
                properties.validateCvc = false;
                if (settings.visualValidationEnabled) {
                    $("#" + settings.cvcInputId).removeClass("valid");
                    $("#" + settings.cvcInputId).addClass("invalid");
                }
            } else {
                properties.validateCvc = true;
                if (settings.visualValidationEnabled) {
                    $("#" + settings.cvcInputId).removeClass("invalid");
                    $("#" + settings.cvcInputId).addClass("valid");
                }
            }

        },
        validateBindingCvc: function () {
            $("#cvcMessage").hide();
            var bindingForm = $('#formBinding');
            if ((properties.isMaestro && bindingForm.find('input[name=cvc]').val() == "") || properties.cvcValidationRequired == false) {
                $("#cvcMessage").show();
                properties.validateCvc = true;
                if (settings.visualValidationEnabled) {
                    $("#" + settings.cvcInputId).removeClass("invalid");
                    $("#" + settings.cvcInputId).addClass("valid");
                }
            } else if (!/^\d{3,4}$/.test(bindingForm.find('input[name=cvc]').val())) {
                properties.validateCvc = false;
                if (settings.visualValidationEnabled) {
                    $("#" + settings.cvcInputId).removeClass("valid");
                    $("#" + settings.cvcInputId).addClass("invalid");
                }
            } else {
                properties.validateCvc = true;
                if (settings.visualValidationEnabled) {
                    $("#" + settings.cvcInputId).removeClass("invalid");
                    $("#" + settings.cvcInputId).addClass("valid");
                }
            }

        },
        validateEmail: function () {
            if (!settings.emailEnabled) {
                properties.validateEmail = true;
                return;
            }
            if ($('#' + settings.emailId).val().split(" ").join("") == "" ||
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test($('#' + settings.emailId).val())) {
                properties.validateEmail = true;
                $("#" + settings.emailId).removeClass("invalid");
                $("#" + settings.emailId).addClass("valid");
            } else {
                properties.validateEmail = false;
                $("#" + settings.emailId).removeClass("valid");
                $("#" + settings.emailId).addClass("invalid");
            }
        },
        validate: function () {
            methods.validateCardholderName();
            methods.validatePan();
            methods.validateCvc();
            methods.validateExpiry();
            methods.validateAgreementCheckbox();
            methods.validateEmail();
            var isValid = properties.validateCardholderName &&
                properties.validatePan &&
                properties.validateExpiry &&
                properties.validateCvc &&
                properties.validateAgreementCheckbox &&
                properties.validateEmail;

            if (!settings.visualValidationEnabled) {
                methods.switchActions(isValid);
            }
            return isValid;
        },
        showProgress: function () {
            $('#errorBlock').empty();
            $('#indicator').show();
        },
        hideProgress: function () {
            $('#indicator').hide();
        },
        showError: function (message) {
            methods.hideProgress();
            $('#errorBlock').empty();
            $('#errorBlock').prepend('<p class="errorField" id="loginError">' + message + "</p>");
        },
        redirect: function (destination, message) {
            if (message) {
                $('#infoBlock').empty();
                $('#infoBlock').prepend('<p>' + message + "</p>");
            }
            $('#numberCountdown').hide();
            $('#errorBlock').empty();
            $('#formPayment').attr('expired', '1');
            methods.switchActions(false);
            document.location = destination;
        },
        startCountdown: function (remainingSecs) {
            $(document).oneTime(remainingSecs * 1000, function () {
                $('#formPayment').attr('expired', '1');
                //methods.validate();
            });

            $('#numberCountdown').everyTime(1000, function (i) {
                var secondsLeft = remainingSecs - i;
                var twoDigitsSeconds = secondsLeft % 60;
                if (twoDigitsSeconds < 10) {
                    twoDigitsSeconds = "0" + twoDigitsSeconds;
                }
                $(this).text(settings.messageTimeRemaining
                    .replace("#MIN#", new String(Math.floor(secondsLeft / 60)))
                    .replace("#SEC#", new String(twoDigitsSeconds)));
                if (secondsLeft <= 0) {
                    //                    methods.redirect(settings.showErrorAction + "?error=payment.errors.session_expired",
                    //                            settings.messageRedirecting);
                    methods.getSessionStatus(false);
                }
            }, remainingSecs);
        },
        setupBindingForm: function (data) {
            var bindingForm = $('#formBinding');
            var bindingItems = data['bindingItems'];
            if (bindingForm.length == 0) {
                // Page template does not support bindings
                return;
            }
            if (typeof bindingItems === 'undefined') {
                // No bindings for this order
                bindingForm.hide();
                return;
            }
            methods.checkControl('#buttonBindingPayment');

            // Build binding select control
            var bindingSelect = bindingForm.find('select[name=bindingId]');
            if (bindingSelect.length != 1) {
                alert('Binding selector not found');
            }
            for (var i = 0; i < bindingItems.length; i++) {
                var o = $('<option value="' + bindingItems[i].id + '">' + bindingItems[i].label + '</option>');
                bindingSelect.append(o);
            }

            var hiddenNodes = bindingForm.find('.rbs_hidden');
            bindingSelect.change(function () {
                hiddenNodes.toggle($(this).val() != '');
            });
            $('#buttonBindingPayment').bind('click', function () {
                if (methods.validateBindingForm() == true) {
                    bindingForm.submit();
                }
                return false;
            });
            bindingForm.bind('submit', methods.sendBindingPayment);

            bindingForm.show();
            hiddenNodes.hide();
        },
        validateBindingForm: function () {
            methods.validateBindingCvc();
            methods.validateAgreementCheckbox();
            methods.validateEmail();
            var isValid = properties.validateAgreementCheckbox && properties.validateCvc && properties.validateEmail;

            if (!settings.visualValidationEnabled) {
                methods.switchBindingsActions(isValid);
            }
            return isValid;
        },
        sendBindingPayment: function () {
            methods.showProgress();
            var orderId = properties.orderId;
            var bindingForm = $('#formBinding');
            var addParams = methods.getAdditionalParams('formBinding');
            $.ajax({
                url: settings.paymentBindingAction,
                type: 'POST',
                cache: false,
                data: {
                    'orderId': orderId,
                    'bindingId': bindingForm.find('select[name=bindingId]').val(),
                    'cvc': bindingForm.find('input[name=cvc]').val(),
                    'email': $("#" + settings.emailInputId).val(),
                    'jsonParams': addParams
                },
                dataType: 'json',
                error: function () {
                    methods.showError(settings.messageAjaxError);
                    return true;
                },
                success: function (data) {
                    methods.hideProgress();
                    if (data['acsUrl'] != null) {
                        methods.redirectToAcs(data);
                    } else if ('error' in data) {
                        methods.showError(data['error']);
                    } else if ('redirect' in data) {
                        methods.redirect(data['redirect'], data['info'], settings.messageRedirecting);
                    }
                    return true;
                }
            });
            return false;
        },
        getSessionStatus: function (informRbsOnLoad) {
            methods.showProgress();
            var orderId = properties.orderId;
            $.ajax({
                url: settings.getSessionStatusAction,
                type: 'POST',
                cache: false,
                data: ({
                    MDORDER: orderId,
                    language: settings.language,
                    informRbsOnLoad: informRbsOnLoad
                }),
                dataType: 'json',
                error: function () {
                    methods.showError(settings.messageAjaxError);
                },
                success: function (data) {
                    methods.hideProgress();
                    if ('cvcNotRequired' in data && data['cvcNotRequired'] == true) {
                        properties.cvcValidationRequired = false;
                    }
                    if ('sslOnly' in data && data['sslOnly'] == true) {
                        if ($('#visa_3dsecure') != null) {
                            $('#visa_3dsecure').hide();
                        }
                        if ($('#mc_3dsecure') != null) {
                            $('#mc_3dsecure').hide();
                        }
                    }
                    if ('feeEnabled' in data) {
                        settings.getFeeEnabled = data['feeEnabled'];
                    }
                    if ('error' in data) {
                        methods.showError(data['error']);
                    } else if ('redirect' in data) {
                        methods.redirect(data['redirect'], settings.messageRedirecting);
                    } else if ('paymentWay' in data) {
                        $('#paymentForm').attr('display', 'none');
                    } else {
                        settings.updatePage(data);
                        var remainingSecs = data['remainingSecs'];
                        if (remainingSecs > 0) {
                            methods.startCountdown(remainingSecs);
                            methods.setupBindingForm(data);
                        } else {
                            methods.redirect(settings.showErrorAction, settings.messageRedirecting);
                        }
                    }
                    settings.onReady();
                    return true;
                }
            });
        },
        getFee: function () {
            if (!properties.validatePan) {
                return;
            }
            if (!settings.getFeeEnabled) {
                return;
            }
            $("#" + settings.feeChecked).val(false);
            methods.showProgress();
            var orderId = properties.orderId;
            $.ajax({
                url: settings.getFeeAction,
                type: 'POST',
                cache: false,
                data: ({
                    mdOrder: orderId,
                    pan: $("#" + settings.panInputId).val()
                }),
                dataType: 'json',
                error: function () {
                    methods.showError(settings.messageAjaxError);
                },
                success: function (data) {
                    methods.hideProgress();
                    if (data['error'] == 0) {
                        properties.fee = data['fee'];
                        $("#" + settings.feeAmount).val(properties.fee);
                    }
                    return true;
                }
            });
        },
        isMaestroCard: function () {
            if (methods.maestroCheck.pan != $("#" + settings.panInputId).val()) { // абаЗаОаВ аИаЗ-аЗаА аИаЗаМаЕаНаЕаНаИб PAN-аА, аНаЕ аИаЗ-аЗаА submit-аА.
                $.ajax({
                    url: settings.isMaestroCardAction,
                    type: 'POST',
                    cache: false,
                    data: ({
                        pan: $("#" + settings.panInputId).val()
                    }),
                    dataType: 'json',
                    error: function () {
                        methods.showError(settings.messageAjaxError);
                    },
                    success: function (data) {
                        if ('error' in data) {
                            methods.showError(data['error']);
                        } else {
                            methods.maestroCheck.pan = $("#" + settings.panInputId).val(); // ааАаПаОаМаНаИаМ баЕаЗбаЛббаАб аВбаЗаОаВаА аДаЛб аЗаАаДаАаНаНаОаГаО PAN-аА, ббаОаБб аНаЕ аДббаГаАбб AJAX аЗбб.
                            methods.maestroCheck.result = data["isMaestro"];
                            properties.isMaestro = data["isMaestro"];
                            //var isValid = true; // а аДаАаНаНаОаМ баЛббаАаЕ isMaestroCard() аНаЕ аВаЕбаНбб аЗаНаАбаЕаНаИб, аПаОббаОаМб аПбаОаВаЕаДбаМ аОббаАбаОаК аВаАаЛаИаДаАбаИаИ аЗаДаЕбб.
                            methods.validateCvc();
//                            if (!settings.visualValidationEnabled) {
//                                methods.switchActions(isValid); // ааКаЛббаИаМ аИаЛаИ аВбаКаЛббаИаМ аКаНаОаПаКб "ааПаЛаАбаИбб".
//                            }
                        }
                    }
                });
                return; // аЂ.аК. methods.maestroCheck.result аВбб баАаВаНаО аНаЕ ббаПаЕаЕб аОаБаНаОаВаИбббб, аА баЕаЗбаЛббаАб аВбаЗаОаВаА ббаНаКбаИаИ validate() баЕаЙбаАб аНаЕ аНбаЖаЕаН, б.аК. ббаО аНаЕ submit.
            }
            return methods.maestroCheck.result; // абаЗаОаВ аНаЕ аИаЗ-аЗаА аИаЗаМаЕаНаЕаНаИб PAN-аА - submit аИаЛаИ аИаЗаМаЕаНаЕаНаИаЕ аДббаГаОаГаО аПаОаЛб. абаЛаИ ббаО submit баЕаЗбаЛббаАб аПбаИаГаОаДаИббб.
        },
        sendPayment: function () {
            methods.showProgress();
            var orderId = properties.orderId;
            var bindingNotNeeded = settings.bindingCheckboxEnabled && !$("#" + settings.bindingCheckBoxId).attr("checked");
            var addParams = methods.getAdditionalParams(settings.paymentFormId);
            $.ajax({
                url: settings.paymentAction,
                type: 'POST',
                cache: false,
                data: ({
                    MDORDER: orderId,
                    $EXPIRY: $("#expiry").attr("value"),
                    $PAN: $("#" + settings.panInputId).val(),
                    MM: $("#" + settings.monthSelectId).val(),
                    YYYY: $("#" + settings.yearSelectId).val(),
                    TEXT: $("#" + settings.cardholderInputId).val(),
                    $CVC: $("#" + settings.cvcInputId).val(),
                    language: settings.language,
                    email: $("#" + settings.emailInputId).val(),
                    bindingNotNeeded: bindingNotNeeded,
                    'jsonParams': addParams
                }),
                dataType: 'json',
                error: function () {
                    methods.showError(settings.messageAjaxError);
                    methods.switchActions(true);
                    return true;
                },
                success: function (data) {
                    methods.hideProgress();
                    methods.switchActions(true);
                    if (data['acsUrl'] != null) {
                        methods.redirectToAcs(data);
                    } else if ('error' in data) {
                        methods.showError(data['error']);
                    } else if ('redirect' in data) {
                        methods.redirect(data['redirect'], data['info'], settings.messageRedirecting);
                    }
                    return true;
                }

            });
        },
        getAdditionalParams: function (paymentFormId) {
            var jsonParams = '{';
            $("#" + paymentFormId + " input[name*='" + settings.paramPrefix + "']").each(function (index, element) {
                jsonParams += '"' + element.id.substring(settings.paramPrefix.length) + '":"' + element.value + '",'
            });
            if (jsonParams.length > 1) {
                jsonParams = jsonParams.substr(0, jsonParams.length - 1);
            }
            jsonParams += "}";
            return jsonParams;
        },
        sendPaymentAlfa: function () {
            methods.showProgress();
            var orderId = properties.orderId;
            $.ajax({
                url: settings.paymentAction,
                type: 'POST',
                cache: false,
                data: ({
                    MDORDER: orderId,
                    paymentWay: 'ALFA_ALFACLICK'
                }),
                dataType: 'json',
                error: function () {
                    methods.showError(settings.messageAjaxError);
                    methods.switchActions(true);
                    return true;
                },
                success: function (data) {
                    methods.hideProgress();
                    methods.switchActions(true);
                    if (data['acsUrl'] != null) {
                        methods.redirectToAcs(data);
                    } else if ('error' in data) {
                        methods.showError(data['error']);
                    } else if ('redirect' in data) {
                        methods.redirect(data['redirect'], data['info'], settings.messageRedirecting);
                    }
                    return true;
                }

            });
        },
        sendPaymentUpop: function () {
            methods.showProgress();
            var orderId = properties.orderId;
            $.ajax({
                url: settings.paymentAction,
                type: 'POST',
                cache: false,
                data: ({
                    MDORDER: orderId,
                    paymentWay: 'UPOP'
                }),
                dataType: 'json',
                error: function () {
                    methods.showError(settings.messageAjaxError);
                    methods.switchActions(true);
                    return true;
                },
                success: function (data) {
                    methods.hideProgress();
                    methods.switchActions(true);
                    if ('redirect' in data) {
                        methods.redirect(data['redirect'], data['info'], settings.messageRedirecting);
                    }
                    return true;
                }

            });
        },
        redirectToAcs: function (data) {
            $('#acs').attr('action', data['acsUrl']);
            $('#PaReq').val(data['paReq']);
            $('#MD').val(properties.orderId);
            $('#TermUrl').val(data['termUrl']);
            $('#acs').submit();
        }
    };


    $.fn.payment = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            return $.error('Method ' + method + ' does not exist on jQuery.payment');
        }
    };
})(jQuery);

jQuery.fn.log = function (msg, type) {
    if (typeof lastSelector == 'undefined') {
        lastSelector = '--';
    }

    if (lastSelector != this.selector.slice(0, lastSelector.length)) {
        if (lastSelector != '--') {
            console.groupEnd();
            lastSelector = '--';
        }
        else {
            lastSelector = this.selector;
        }
        console.group("%s (%s)", msg, this.selector);
    }

    if (type == undefined) {
        type = "log";
    }
    switch (type) {
        case "log":
            console.log(this);
            break;
        case "warn":
            console.warn(this);
            break;
        case "info":
            console.info(this);
            break;
        case "error":
            console.error(this);
            break;
        case "time":
            console.time(msg);
            break;
        case "timestop":
            console.timeEnd(msg);
            break;
        case "profile":
            console.profile(msg);
            break;
        case "profilestop":
            console.profileEnd(msg);
            break;
    }
    return this;
};

/**
 * Is pressed key a number key
 * @param keyCode
 */
function isNumber(keyCode) {
    return ( keyCode > 47 && keyCode < 58 );
}

function isControl(keyCode) {
    return keyCode in {
            8: 1,
            9: 1,
            13: 1,
            16: 1,
            17: 1,
            18: 1,
            20: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            45: 1,
            46: 1
        };
}

function isChar(keyCode) {
    return ( keyCode > 96 && keyCode < 133 ) || (keyCode > 64 && keyCode < 91);
}

function isSpace(keyCode) {
    return keyCode == 32;
}

function isDot(keyCode) {
    return keyCode == 46 || keyCode == 39;
}

function luhn(num) {
    num = (num + '').replace(/\D+/g, '').split('').reverse();
    if (!num.length)
        return false;
    var total = 0, i;
    for (i = 0; i < num.length; i++) {
        num[i] = parseInt(num[i]);
        total += i % 2 ? 2 * num[i] - (num[i] > 4 ? 9 : 0) : num[i];
    }
    return (total % 10) == 0;
}