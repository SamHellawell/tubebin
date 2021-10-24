import Router from 'next/router';
import { debounce } from 'throttle-debounce';
import { SearchIcon } from '@heroicons/react/outline';
import React from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';

const FIELD_DEBOUNCE_TIMER = 500;
const suggestionCache = {};

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
  return suggestion;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion}</span>
  );
}

// Gets suggestions from the API route and filters them
async function getSuggestions(value, max = 32) {
  const escapedValue = escapeRegexCharacters(value.trim());
  if (escapedValue === '') {
    return [];
  }

  if (escapedValue.length < 3) {
    return [];
  }

  const searchResults = suggestionCache[escapedValue] ?
    suggestionCache[escapedValue] :
    await axios.get(`/api/suggestions?q=${escapedValue}`);

  const suggestions = searchResults.data;
  const regex = new RegExp('^' + escapedValue, 'i');

  suggestionCache[escapedValue] = searchResults;
  return suggestions.filter(suggestion => regex.test(suggestion)).slice(0, max);
}

export default class AutocompleteSearch extends React.Component {
  constructor({ defaultValue, onChange }) {
    super();

    this.state = {
      value: defaultValue || '',
      suggestions: []
    };

    this.fetchDebounced = debounce(FIELD_DEBOUNCE_TIMER, this.fetchSuggestions);
    this.parentOnChange = onChange;
  }

  onChange = (event, { newValue }) => {
    this.parentOnChange(newValue);
    this.setState({
      value: newValue
    });
  };

  fetchSuggestions = async () => {
    if (this.state.suggestionValue === this.state.value) {
      return;
    }

    try {
      const suggestions = await getSuggestions(this.state.value, this.props.maxSuggestions);
      this.setState({
        suggestions,
        suggestionValue: this.state.value,
      });
    } catch (e) {
      // no-op
    }
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onFormSubmit = async (e) => {
    e.preventDefault();
    const searchQuery = this.state.value;
    if (!searchQuery) {
      return;
    }

    this.props.setIsLoading(true);
    await Router.push({ pathname: '/search', query: { q: searchQuery } });
    this.props.setIsLoading(false);
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Search for videos...',
      className: this.props.className,
      onChange: this.onChange,
      name: 'query',
      type: 'text',
      autoCorrect: 'off',
      autoCapitalize: 'none',
      autoComplete: 'off',
      autoFocus: true,
      value,
    };

    const containerProps = {
      className: 'react-autosuggest__container w-full',
    };

    return (
      <form
        method="GET"
        action="/search"
        onSubmit={this.onFormSubmit}
        className={this.props.formClassName}>
        <div className={this.props.wrapperClassName}>
          <Autosuggest
            containerProps={containerProps}
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.fetchDebounced}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps} />
          {!this.props.disableButton && !this.props.formButtons && (
            <button
              type="submit"
              style={{
                minWidth: '80px',
              }}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border-t border-r border-b border-gray-300 rounded-r-md shadow h-10 flex center-items justify-center"
              onClick={this.onFormSubmit}>
              <SearchIcon className="text-gray-600 h-5 w-5" />
            </button>
          )}
        </div>

        {this.props.formButtons}
      </form>
    );
  }
}
