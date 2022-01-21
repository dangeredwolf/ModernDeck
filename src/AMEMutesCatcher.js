



const MTD_MUTE_CATCHES_KEY = `mtd_ame_mute_catches`;

function safeInitialDataFromLocalStorage() {
  const raw = window.localStorage.getItem(MTD_MUTE_CATCHES_KEY);

  try {
    const parsed = JSON.parse(raw || '[]');

    if (!isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (e) {
    return [];
  }
}

window.addEventListener('beforeunload', () => {
  window.localStorage.setItem(MTD_MUTE_CATCHES_KEY, JSON.stringify(muteCatches));
});

export function formatMuteReason(muteCatch) {
  const {filterType, value} = muteCatch;

  switch (filterType) {
    case TweetDeckFilterTypes.SOURCE: {
      return `tweeted using "${value}"`;
    }
    case TweetDeckFilterTypes.PHRASE: {
      return `tweeted the phrase "${value}"`;
    }
    case AMEFilters.REGEX: {
      return `a tweet matched the regex \`/${value}/gi\``;
    }
    case AMEFilters.NFT_AVATAR: {
      return `uses the NFT avatar integration`;
    }
    case AMEFilters.DEFAULT_AVATARS: {
      return `had a default avatar`;
    }
    case AMEFilters.FOLLOWER_COUNT_GREATER_THAN: {
      return `had more than ${Number(value).toLocaleString()} followers`;
    }
    case AMEFilters.FOLLOWER_COUNT_LESS_THAN: {
      return `had less than ${Number(value).toLocaleString()} followers`;
    }
    case AMEFilters.USER_BIOGRAPHIES: {
      return `biography matched the phrase "${value}"`;
    }
    case AMEFilters.USER_REGEX: {
      return `username matched the regex \`/${value}/gi\` `;
    }
    case AMEFilters.REGEX_DISPLAYNAME: {
      return `display name matched the regex \`/${value}/gi\` `;
    }
    case AMEFilters.MUTE_USER_KEYWORD: {
      return `has tweeted the keyword "${value.split('|')[1]}"`;
    }
    default: {
      return `${filterType} ${value}`;
    }
  }
}

export const setupMuteCatcher = makeBTDModule(({TD, jq}) => {
  TD_mustaches["settings/global_setting_filter.mustache"] = TD_mustaches["settings/global_setting_filter.mustache"].replace(
    `<div class="divider-bar"></div> `,
    `<div class="divider-bar"></div>  
  <div class="txt-size--12"> <i class="icon-btd icon-large obj-left color-twitter-gray"></i> <p class="nbfc margin-t--2"> Better TweetDeck keeps track of users that are caught by the mutes you define. <br/> <a href="#" data-action="btd-open-catches">Click here to review them or export them</a></p> </div>
  <div class="divider-bar"></div>`
  )
});