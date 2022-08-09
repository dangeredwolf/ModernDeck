/*
	Boot/Items/ExternalLoginHandler.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { UIExternalLoginApproval } from "../../UIExternalLoginApproval";

export const checkForExternalLoginPending = () => {
	if (window.location.href.indexOf("moderndeck_external_login=1") > -1) {
        new UIExternalLoginApproval();
    }
}