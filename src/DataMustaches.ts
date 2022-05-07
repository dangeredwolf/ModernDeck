/*
	DataMustaches.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { I18n } from "./I18n";

export const loginPage: string = `<div class="app-signin-wrap mtd-signin-wrap">
	<div class="js-signin-ui app-signin-form pin-top pin-right txt-weight-normal">
		<section class="js-login-form form-login startflow-panel-rounded mtd-signin-form" data-auth-type="twitter">
			<h2 class="form-legend padding-axl">
				Good evening
			</h2>
			<h3 class="form-legend padding-axl">
				${I18n("Welcome to ModernDeck")}
			</h3>
			<i class="icon icon-moderndeck"></i>
			<div class="margin-a--16">
				<div class="js-login-error form-message form-error-message error txt-center padding-al margin-bxl is-hidden">
					<p class="js-login-error-message">
						${I18n("An unexpected error occurred. Please try again later.")}
					</p>
				</div>
				<a href="https://mobile.twitter.com/login?hide_message=true&amp;redirect_after_login=https%3A%2F%2Ftweetdeck.twitter.com%2F%3Fvia_twitter_login%3Dtrue" class="Button Button--primary block txt-size--18 txt-center btn-positive">
					${I18n("Sign in with Twitter")}
				</a>
				<div class="divider-bar"></div>
			</section>
		</div>
	</div>
</div>
<div class="mtd-login-info">
	<button class="mtd-login-info-button">
		<i class="material-icon">info_outline</i>
	</button>
	<p class="mtd-login-info-version">${window.ModernDeck.versionFriendlyString} - ${window.ModernDeck.buildNumber}</p>
</div>`;


export const spinnerSmall: string =
'<div class="preloader-wrapper active">\
	<div class="spinner-layer small">\
		<div class="circle-clipper left">\
			<div class="circle"></div>\
		</div>\
		<div class="gap-patch">\
			<div class="circle"></div>\
		</div>\
		<div class="circle-clipper right">\
			<div class="circle"></div>\
		</div>\
	</div>\
</div>';

export const spinnerLarge: string =
'<div class="preloader-wrapper active">\
	<div class="spinner-layer">\
		<div class="circle-clipper left">\
			<div class="circle"></div>\
		</div>\
		<div class="gap-patch">\
			<div class="circle"></div>\
		</div>\
		<div class="circle-clipper right">\
			<div class="circle"></div>\
		</div>\
	</div>\
</div>';

export const spinnerTiny: string =
'<div class="preloader-wrapper active">\
	<div class="spinner-layer tiny">\
		<div class="circle-clipper left">\
			<div class="circle"></div>\
		</div>\
		<div class="gap-patch">\
			<div class="circle"></div>\
		</div>\
		<div class="circle-clipper right">\
			<div class="circle"></div>\
		</div>\
	</div>\
</div>';

export const buttonSpinner =
'<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner preloader-wrapper active tiny">\
	<div class="spinner-layer small">\
		<div class="circle-clipper left">\
			<div class="circle"></div>\
		</div>\
		<div class="gap-patch">\
			<div class="circle"></div>\
		</div>\
		<div class="circle-clipper right">\
			<div class="circle"></div>\
		</div>\
	</div>\
</div>';
