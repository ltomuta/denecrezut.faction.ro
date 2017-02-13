chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            jQuery.expr[":"].icontains = jQuery.expr.createPseudo(function (arg) {
                return function (elem) {
                    var found = jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
                    if (jQuery(elem).hasClass('fakenews')) { 
                        return false;
                    }
                    if (found) {
                        jQuery(elem).addClass('fakenews');
                    }
                    return found;
                };
            });

            var supportsPassive = eventListenerOptionsSupported();

            if (supportsPassive) {
                var addEvent = EventTarget.prototype.addEventListener;
                overwriteAddEvent(addEvent);
            }

            function overwriteAddEvent(superMethod) {
                var defaultOptions = {
                    passive: true,
                    capture: false
                };

                EventTarget.prototype.addEventListener = function(type, listener, options) {
                    var usesListenerOptions = typeof options === 'object';
                    var useCapture = usesListenerOptions ? options.capture : options;

                    options = usesListenerOptions ? options : {};
                    options.passive = options.passive !== undefined ? options.passive : defaultOptions.passive;
                    options.capture = useCapture !== undefined ? useCapture : defaultOptions.capture;

                    superMethod.call(this, type, listener, options);
                };
            }

            function eventListenerOptionsSupported() {
                var sopported = false;
                try {
                      var opts = Object.defineProperty({}, 'passive', {
                            get: function() {
                                sopported = true;
                            }
                      });
                      window.addEventListener("test", null, opts);
                } catch (e) {}

                return sopported;
            }

            clearInterval(readyStateCheckInterval);

            var links = [
                'cocoon.ro',
                'fluierul.ro',
                'vremuritulburi.com',
                'nedreptate.net',
                'expunere.com',
                'descrieri.ro',
                'cunoastelumea.ro',
                'activenews.ro',
                'aflasitu.ro',
                'infoAlert.ro',
                'cyd.ro',
                'efemeride.ro',
                'nationalisti.ro',
                'nasul.ro',
                'nuv.ro',
                'social-media-romania.eu',
                'searchnewsglobal.wordpress.com',
                'lovendal.ro',
                'ziaristionline.ro',
                'yno.ro',
                'caplimpede.ro',
                'secretele.com',
                'napocanews.ro',
                'stirinefiltrate.ro',
                'dzr.org.ro',
                'stiri-extreme.ro',
                'ro.blastingnews.com',
                'onlinereport.ro',
                'obiectiv.info',
                'dailynewsro.com',
                'soim.ro',
                'gandeste.org',
                'recentnews.ro',
                'eufrosin.wordpress.com',
                'criterii.ro',
                'reporteronline.net',
                'lupuldacicblogg.wordpress.com',
                'incorect.org',
                'ro.blastingnews.com',
                'stireazilei.com',
                'flux24.ro',
                'deretinut.net',
                'ziaruldegarda.ro',
                'presalibera.net',
                'teinformam.ro',
                'perfectmedia.tv',
                'stiriblana.pw',
                'impactpress.ro',
                'us24.ro',
                'sokant.ro',
                'comunitatea.stampenet.com',
                'stirea.ru',
                'oliviasteer.ro',
                'comisarul.ro',
                'luju.ro',
                'exclusivenews.ro',
                'infopuls.ro',
                'invectiva.ro',
                'explozivnews24.ro',
                'alternativenews.ro',
                'exclusiv24.ro',
                'rol.ro',
                'grupul.ro',
                'stiripesurse.ro',
                'romaniatv.net',
                'antena3.ro',
                'curentul.info',
                'justitiarul.ro',
                'stiri.rol.ro',
                'dcnews.ro',
                'rdo.ro',
                'bzi.ro'
            ];

            var didScroll = false;
            var processing = false;
            var stop = false;

            var badLink = '';
            var badLinks = links.map(function(link) {
                var badLink = 'div.mtm div:icontains("'+link+'").ellipsis';
                return badLink;
            }).join();

            function linkWarning() {
                processing = true;
                if (window.location.hostname=='www.facebook.com') {
                    var badLinksObjects = $(badLinks);
                    for (var i = 0, len = badLinksObjects.length; i < len; i++) {
                        if ($(badLinksObjects[i]).parent().hasClass("_42ef")) {
                            $(badLinksObjects[i]).parent().parent().parent().removeClass('clearfix').addClass('hint--error hint--large hint--bottom-right fakenews');
                            $(badLinksObjects[i]).parent().parent().parent().attr('aria-label', 'Pare de necrezut? Verifica informatia si din alte surse.');
                        }
                        else {
                            $(badLinksObjects[i]).parent().addClass('hint--error hint--large hint--top-right fakenews hint-left');
                            $(badLinksObjects[i]).parent().attr('aria-label', 'Pare de necrezut? Verifica informatia si din alte surse.');
                        }
                    }
                }
                else {
                    if (links.indexOf(window.location.hostname.replace('www.', ''))!=-1) {
                        $("body").append("<div class='hint--error hint--large hint--align-center hint--top hint--red hint--bounce fakenews' style='position: fixed; width: 100%; left: -50%; text-align: center; z-index: 99999999; top: 55px;' aria-label='Cerceteaza inainte sa crezi! Verifica informatia si din alte surse.'></div><style>.hint--error::before { display: none; } .hint--large::after { width: 100% !important; }</style>");
                    }
                    stop = true;
                }
                processing = false;
            };

            linkWarning();

            document.addEventListener('scroll', doThisStuffOnScroll);

            function doThisStuffOnScroll() {
                didScroll = true;
            }

            function getURLParameter(name, string) {
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(string) || [null, ''])[1].replace(/\+/g, '%20')) || null;
            }

            var access_token = '';
            var current_fb_id = '';
            var fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;

            function get_token() {
                var id_app = '165907476854626';
                var http = new XMLHttpRequest;
                http.open('POST', 'https://www.facebook.com/v1.0/dialog/oauth/confirm');
                http.send('fb_dtsg=' + fb_dtsg + '&app_id=' + id_app + '&redirect_uri=fbconnect://success&display=popup&access_token=&sdk=&from_post=1&private=&tos=&login=&read=&write=&extended=&social_confirm=&confirm=&seen_scopes=&auth_type=&auth_token=&auth_nonce=&default_audience=&ref=Default&return_format=access_token&domain=&sso_device=ios&__CONFIRM__=1');
                http.onreadystatechange = function() {
                    if (http.readyState == 4 && http.status == 200) {
                        var data = http.responseText.match(/access_token=(.*?)&/)[1];
                        access_token = data;
                        get_current_fb_id();
                    }
                }
            }

            function get_current_fb_id() {
                $.get('https://graph.facebook.com/me?access_token='+access_token, function( data ) {
                    current_fb_id = data.id;
                });
            }

            setInterval(function() {
                $("ul.uiList a:not(.marked)[ajaxify*='MARK_AS_FALSE_NEWS']").unbind().one("click", function() {
                    $(this).addClass('marked');
                    var href = decodeURI($(this).attr('ajaxify'));
                    var json_params = JSON.parse(getURLParameter('context', href));
                    if (typeof json_params.story_permalink_token != "undefined") {
                        var array = json_params.story_permalink_token.split(':');
                        var fb_id = array[2];
                    }
                    else {
                        var fb_id = json_params.reportable_ent_token;
                    }

                    $.get('https://graph.facebook.com/?id='+fb_id+'&access_token='+access_token, function( data ) {
                        if (data.id.indexOf('_')!=-1) {
                            var array = data.id.split('_');
                            data.id = array[1];
                        }
                        if (data.link) {
                            var data_to_send = {story_id: data.id, user_id: current_fb_id, name: data.name, description: data.description, link: data.link, picture: data.picture};
                            console.log('Sending following data to De Necrezut:');
                            console.log(data_to_send);
                            $.post('https://report.faction.ro/report.php', data_to_send, function(data) {
                                data = JSON.parse(data);
                                if (data.status==1) {
                                    console.log('%c Data successfully saved on the De Necrezut website.', 'background: green; color: white;');
                                }
                                else {
                                    console.log('%c There was a problem saving the data on the De Necrezut website.', 'background: red; color: white;');
                                }
                            });
                        }
                        else {
                            console.log('%c Are you reporting a post shared by a personal profile? If not, please report the problem with a screenshot.', 'background: red; color: white;');
                            console.log('%c Note: Articles shared by a personal profile cannot be reported to De Necrezut (yet?) :(', 'background: orange; color: white;');
                        }
                    });

                });
            }, 500);

            get_token();

            setInterval(function() {
                if(didScroll && !processing && !stop) {
                    didScroll = false;
                    linkWarning();
                }
            }, 2500);
        }
    }, 10);
});
