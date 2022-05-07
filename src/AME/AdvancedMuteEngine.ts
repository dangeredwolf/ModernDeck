/*
 * Advanced Mute Engine for TweetDeck
 * Copyright (c) 2017 pixeldesu
 * Converted to TypeScript by eramdam
 * 
 * Based off of the modifications made by Damien Erambert for Better TweetDeck
 *
 * This version of the AME is modified for usage in ModernDeck
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

import { ChirpBaseTypeEnum, TweetDeckChirp, TweetDeckFilter, TweetDeckFilterTypes, TweetDeckObject } from '../Types/TweetDeck';

/*
  ModernDeck uses the BTD namespace for AME to enable interoperability between them,
  and so mutes will work across them whenever ModernDeck fully supports AME in the future.
*/

export enum AMEFilters {
	NFT_AVATAR = 'BTD_nft_avatar',
	IS_RETWEET_FROM = 'BTD_is_retweet_from',
	MUTE_USER_KEYWORD = 'BTD_mute_user_keyword',
	REGEX_DISPLAYNAME = 'BTD_mute_displayname',
	REGEX = 'BTD_regex',
	USER_REGEX = 'BTD_user_regex',
	MUTE_QUOTES = 'BTD_mute_quotes',
	USER_BIOGRAPHIES = 'BTD_user_biographies',
	DEFAULT_AVATARS = 'BTD_default_avatars',
	FOLLOWER_COUNT_LESS_THAN = 'BTD_follower_count_less_than',
	FOLLOWER_COUNT_GREATER_THAN = 'BTD_follower_count_greater_than',
	SPECIFIC_TWEET = 'BTD_specific_tweet',
	HASHTAGS_NUMBER = 'BTD_hashtags_number',
}

import * as t from 'io-ts';
import { getPref } from '../StoragePreferences';

interface AMEFilter {
  name: string;
  descriptor: string;
  placeholder: string;
  display?: AMEDisplayOptions;
  options?: AMEFilterOptions;
  function(filter: TweetDeckObject['vo']['Filter'], chirp: TweetDeckChirp): boolean;
}

interface AMEDisplayOptions {
  global?: boolean;
  actions?: boolean;
  options?: boolean;
}

interface AMEFilterOptions {
  templateString?: string;
  nameInDropdown?: string;
}

const RMuteCatch = t.type({
	filterType: t.union([makeEnumRuntimeType(AMEFilters), makeEnumRuntimeType(TweetDeckFilterTypes)]),
	value: t.string,
	user: t.type({
		avatar: t.string,
		id: t.string,
		screenName: t.string,
		name: t.string,
	}),
});

export interface MuteCatch extends t.TypeOf<typeof RMuteCatch> {
	filterType: any;
}

const nonUserSpecificsTypes = [
	TweetDeckFilterTypes.SOURCE,
	TweetDeckFilterTypes.PHRASE
];

const userSpecificTypes = [
  AMEFilters.MUTE_USER_KEYWORD,
  AMEFilters.HASHTAGS_NUMBER,
  AMEFilters.REGEX_DISPLAYNAME,
  AMEFilters.REGEX,
  AMEFilters.USER_REGEX,
  AMEFilters.USER_BIOGRAPHIES,
  AMEFilters.DEFAULT_AVATARS,
  AMEFilters.FOLLOWER_COUNT_LESS_THAN,
  AMEFilters.FOLLOWER_COUNT_GREATER_THAN,
];

export const muteTypeAllowlist = [...nonUserSpecificsTypes, ...userSpecificTypes] as const;
type AllowedMuteTypes = typeof muteTypeAllowlist[number];

function getInitialMuteCatches() {
	const fromLocalStorage = getPref("mtd_mute_catches");
	return new Map<string, MuteCatch>(fromLocalStorage);
}

const muteCatches = getInitialMuteCatches();

export const clearMuteCatches = () => {
	muteCatches.clear();
};

export function removeCatchesByFilter(filter: { type: string; value: string }) {
	Array.from(muteCatches.entries()).forEach(([key, value]) => {
		if (value.filterType === filter.type && value.value === filter.value) {
			muteCatches.delete(key);
		}
	});
}

function getMeaningfulUser(target: TweetDeckChirp) {
	return (
		target.retweetedStatus?.user ||
		target.sourceUser ||
		target.user ||
		target.following ||
		target.owner
	);
}

function serializeMuteCatch(target: TweetDeckChirp, filter: TweetDeckFilter): MuteCatch {
	const meaningfulUser = getMeaningfulUser(target);
	if (!meaningfulUser) {
		console.debug(filter, target);
	}

	const simplifiedUser = {
		avatar: meaningfulUser.profileImageURL,
		id: meaningfulUser.id,
		screenName: meaningfulUser.screenName,
		name: meaningfulUser.name,
	};

	return {
		filterType: filter.type as AllowedMuteTypes,
		value: filter.value,
		user: simplifiedUser,
	};
}

export function encodeCatchKey(muteCatch: MuteCatch) {
	return [muteCatch.filterType, muteCatch.user.id, encodeURIComponent(muteCatch.value)].join('$_$');
}
export function maybeLogMuteCatch(
	target: TweetDeckChirp,
	filter: TweetDeckFilter,
	shouldDisplay: boolean
) {
	return new Promise<void>((resolve) => {
		// If the filter isn't part of our allowlist, nothing to do.
		if (!muteTypeAllowlist.includes(filter.type as any)) {
			return resolve();
		}
		// Serialize our catch for easy storage
		const serialized = serializeMuteCatch(target, filter);

		// Make a unique key based on target+filter+value
		const catchKey = encodeCatchKey(serialized);

		if (muteCatches.has(catchKey)) {
			// If the target was previously matched and isn't anymore, then we can remove them.
			if (shouldDisplay && !nonUserSpecificsTypes.includes(filter.type)) {
				muteCatches.delete(catchKey);
			}
			// Otherwise, we can stop here
			return resolve();
		}

		if (shouldDisplay) {
			return resolve();
		}

		// If we have a user-specific filter type, make sure we're logging the right user.
		if (
			userSpecificTypes.includes(filter.type as unknown as AMEFilters) &&
			getMeaningfulUser(target).screenName !== target.user.screenName
		) {
			return resolve();
		}

		muteCatches.set(catchKey, serialized);
		return resolve();
	});
}

export function makeEnumRuntimeType<T extends Object>(srcEnum: object) {
  const enumValues = new Set(Object.values(srcEnum));
  return new t.Type<T, string>(
    'Enum',
    (value: any): value is T => Boolean(value && enumValues.has(value)),
    (value, context) => {
      if (!value || !enumValues.has(value)) return t.failure(value, context);

      return t.success(value as any as T);
    },
    (value) => value.toString()
  );
}

type AMEFiltersMap = {[k in AMEFilters]: AMEFilter};

export const RAMEFilters = makeEnumRuntimeType<AMEFilters>(AMEFilters);

export const setupAME = () => {
  // Save references of original functions
  TD.vo.Filter.prototype._getDisplayType = TD.vo.Filter.prototype.getDisplayType;
  TD.vo.Filter.prototype._pass = TD.vo.Filter.prototype.pass;

  TD.controller.filterManager._addFilter = TD.controller.filterManager.addFilter;
  TD.controller.filterManager._removeFilter = TD.controller.filterManager.removeFilter;

  // Custom filters
  const AmeFilters: AMEFiltersMap = {
    [AMEFilters.NFT_AVATAR]: {
      display: {
        global: false,
        options: false,
        actions: false,
      },
      name: 'Mute accounts with an NFT avatar',
      descriptor: 'accounts with an NFT avatar',
      placeholder: 'nothing!',
      function(t, e) {
        if (typeof e.user?.hasNftAvatar === 'undefined') {
          return true;
        }

        return e.user.hasNftAvatar === false;
      },
    },
    [AMEFilters.SPECIFIC_TWEET]: {
      name: 'Specific tweet',
      descriptor: 'specific tweet',
      placeholder: 'ID of tweet',
      options: {
        templateString: '{{chirp.id}}',
        nameInDropdown: 'Hide this tweet',
      },
      function(t, e) {
        if (e.id === t.value) {
          return false;
        }

        return true;
      },
    },
    [AMEFilters.IS_RETWEET_FROM]: {
      display: {
        actions: true,
      },
      name: 'Retweets from User',
      descriptor: 'retweets from',
      placeholder: 'e.g. tweetdeck',
      function(t, e) {
        return !(e.isRetweetedStatus() && t.value === e.user.screenName.toLowerCase());
      },
    },
    [AMEFilters.MUTE_USER_KEYWORD]: {
      display: {
        global: true,
      },
      name: 'Keyword from User',
      descriptor: 'user|keyword: ',
      placeholder: 'e.g. tweetdeck|feature',
      function(t, e) {
        if (!e.user) return true;
        const filter = t.value.split('|');
        const user = filter[0];
        const keyword = filter[1];

        return !(
          e.text.toLowerCase().includes(keyword) && user === e.user.screenName.toLowerCase()
        );
      },
    },
    [AMEFilters.HASHTAGS_NUMBER]: {
      display: {
        global: true,
      },
      name: 'Tweet contains more than X hashtags',
      descriptor: 'tweets with more than X hashtags',
      placeholder: 'Enter a number',
      function(t, e) {
        if (!e.entities) {
          return true;
        }

        if (!Number.isSafeInteger(Number(t.value))) {
          return true;
        }

        return e.entities.hashtags.length <= Number(t.value);
      },
    },
    [AMEFilters.REGEX_DISPLAYNAME]: {
      display: {
        global: true,
      },
      name: 'Display name (Regular Expression)',
      descriptor: 'display names matching',
      placeholder: 'Enter a keyword or phrase',
      function(t, e) {
        if (!e.user) return true;
        const regex = new RegExp(t.value, 'gi');

        return !e.user.name.match(regex);
      },
    },
    [AMEFilters.REGEX]: {
      display: {
        global: true,
      },
      name: 'Tweet Text (Regular Expression)',
      descriptor: 'tweets matching',
      placeholder: 'Enter a regular expression',
      function(t, e) {
        const regex = new RegExp(t.value, 'gi');

        return !e.getFilterableText().match(regex);
      },
    },
    [AMEFilters.USER_REGEX]: {
      display: {
        global: true,
      },
      name: 'Username (Regular Expression)',
      descriptor: 'usernames matching',
      placeholder: 'Enter a regular expression',
      function(t, e) {
        if (!e.user) return true;
        const regex = new RegExp(t.value, 'gi');

        return !e.user.screenName.match(regex);
      },
    },
    [AMEFilters.MUTE_QUOTES]: {
      display: {
        actions: true,
      },
      name: 'Quotes from User',
      descriptor: 'quotes from',
      placeholder: 'e.g. tweetdeck',
      function(t, e) {
        if (!e.user) return true;

        return !(e.isQuoteStatus && t.value === e.user.screenName.toLowerCase());
      },
    },
    [AMEFilters.USER_BIOGRAPHIES]: {
      display: {
        global: true,
      },
      name: 'Biography',
      descriptor: 'users whose bio contains',
      placeholder: 'Enter a keyword or phrase',
      function(t, e) {
        if (!e.user) return true;

        return !e.user.description.toLowerCase().includes(t.value);
      },
    },
    [AMEFilters.DEFAULT_AVATARS]: {
      display: {
        global: true,
      },
      name: 'Default Profile Pictures',
      descriptor: 'users having a default profile picture',
      placeholder: '',
      function(t, e) {
        if (!e.user) return true;

        return !e.user.profileImageURL.includes('default');
      },
    },
    [AMEFilters.FOLLOWER_COUNT_LESS_THAN]: {
      display: {
        global: true,
      },
      name: 'Follower count less than',
      descriptor: 'users with less followers than',
      placeholder: 'Enter a number',
      function(t, e) {
        if (!e.user) return true;

        return !(e.user.followersCount < parseInt(t.value, 10));
      },
    },
    [AMEFilters.FOLLOWER_COUNT_GREATER_THAN]: {
      display: {
        global: true,
      },
      name: 'Follower count more than',
      descriptor: 'users with more followers than',
      placeholder: 'Enter a number',
      function(t, e) {
        if (!e.user) return true;

        return !(e.user.followersCount > parseInt(t.value, 10));
      },
    },
  };

  // Custom _getFilterTarget implementation to take RTs into account.
  function getAMEFilterTarget(
    e: TweetDeckChirp,
    filterTarget: 'parent' | 'child',
    filterType: AMEFilters
  ) {
    if (e.targetTweet && filterTarget !== 'parent') {
      return e.targetTweet;
    }

    if (userSpecificTypes.includes(filterType) && e.retweetedStatus) {
      return e.retweetedStatus;
    }

    return e;
  }

  // Custom pass function to apply our filters
  TD.vo.Filter.prototype.pass = function pass(e) {
    if (RAMEFilters.is(this.type)) {
      try {
        const t = this;
        e = getAMEFilterTarget(e, this.filterTarget, this.type);

        // @ts-ignore
        const shouldDisplay = AmeFilters[this.type].function(t, e);
        if (e.chirpType === ChirpBaseTypeEnum.TWEET || e.chirpType === ChirpBaseTypeEnum.UNKNOWN) {
          maybeLogMuteCatch(e, this, shouldDisplay);
        }

        return shouldDisplay;
      } catch (e) {
        console.error(e);
        return true;
      }
    }

    const shouldDisplay = this._pass(e);

    if (e.chirpType === ChirpBaseTypeEnum.TWEET || e.chirpType === ChirpBaseTypeEnum.UNKNOWN) {
      maybeLogMuteCatch(e, this, shouldDisplay);
    }

    return shouldDisplay;
  };

  TD.controller.filterManager.removeFilter = function removeFilter(filter) {
    const foundFilter = TD.controller.filterManager.getAll().find((f) => f.id === filter.id);
    if (foundFilter) {
      removeCatchesByFilter(foundFilter);
    }
    return this._removeFilter(filter);
  };

  // Custom display type function to show proper description in filter list
  TD.vo.Filter.prototype.getDisplayType = function getDisplayType() {
    if (RAMEFilters.is(this.type)) {
      // @ts-ignore
      return AmeFilters[this.type].descriptor;
    }
    return this._getDisplayType();
  };

  // $(document).on('change', '.js-filter-types', (e) => {
  //   e.preventDefault();

  //   const options = e.target.options;
  //   const filter = e.target.options[options.selectedIndex].value;

  //   if (RAMEFilters.is(filter)) {
  //     $('.js-filter-input').attr('placeholder', AmeFilters[filter].placeholder);
  //   }
  // });

  $('body').on('click', '[data-mtd-filter]', (ev) => {
    ev.preventDefault();
    const filter = $(ev.target).data('mtd-filter');
    const value = $(ev.target).data('mtd-value');

    TD.controller.filterManager.addFilter(filter, value);
  });

}