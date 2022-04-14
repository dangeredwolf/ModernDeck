/*
	Boot/Items/AjaxPrefilter.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

export const initAjaxPrefilter = () => {
	$.ajaxPrefilter((ajaxOptions: JQuery.AjaxSettings) => {
		try {
			const url: URL = new URL(ajaxOptions.url || '');
	
			if (!url.searchParams.has('include_entities')) {
				return;
			}
	
			ajaxOptions.url = ajaxOptions.url + "&ext=mediaStats,highlightedLabel,voiceInfo,superFollowMetadata&include_ext_has_nft_avatar=true"
		} catch (e: unknown) {
		  console.error(e)
		}
	});
}