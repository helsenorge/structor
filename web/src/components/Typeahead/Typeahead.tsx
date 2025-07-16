/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

import { ValueSetComposeIncludeConcept } from "fhir/r4";
import "./Typeahead.css";

type Props = {
  items: ValueSetComposeIncludeConcept[];
  onChange: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
};

const Typeahead = ({
  items,
  onChange,
  defaultValue,
  placeholder,
}: Props): React.JSX.Element => {
  const ref = useRef(null);

  const [value, setValue] = useState<string>(defaultValue || "");
  const [suggestions, setSuggestions] = useState<
    ValueSetComposeIncludeConcept[]
  >([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const target = e.target.value;
    setValue(target);
    if (target.length >= 1) {
      const matching = [...items]
        .sort()
        .filter(
          (item) =>
            item.display &&
            item.display.toLowerCase().includes(target.toLowerCase()),
        );
      setSuggestions(matching.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (selected: ValueSetComposeIncludeConcept): void => {
    if (selected.display) {
      setValue(selected.display);
    }
    setSuggestions([]);
    onChange(selected.code);
  };

  const getHighlightedText = (text: string, highlight: string): JSX.Element => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <strong key={part + index.toString()}>{part}</strong>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  const clear = (): void => {
    setValue("");
    setSuggestions([...items]);
  };

  const handleClear = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Escape") {
      clear();
    }
  };

  const handleClickOutside = (event: MouseEvent): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (ref.current.contains(event.target)) {
      return;
    }
    setSuggestions([]);
  };

  useEffect(() => {
    if (suggestions.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [suggestions]);

  const renderSuggestions = (): JSX.Element => {
    return (
      <ul>
        {suggestions?.map((suggestion, index) => (
          <li
            key={index}
            aria-label={suggestion.display}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="button"
            tabIndex={0}
            onKeyUp={(e) =>
              e.key === "Enter" &&
              suggestion?.display &&
              handleSelect(suggestion)
            }
            onClick={() => suggestion.display && handleSelect(suggestion)}
          >
            {suggestion.display && (
              <p>{getHighlightedText(suggestion.display, value)}</p>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="typeahead" ref={ref}>
      <div className="input-wrapper">
        <i className="search-icon" />
        <input
          onFocus={(event) =>
            event.currentTarget.value.length === 0 && setSuggestions([...items])
          }
          onKeyUp={(event) => handleClear(event)}
          onChange={handleChange}
          placeholder={placeholder || "Søk.."}
          value={value}
          type="text"
        />
        {(value.length > 0 || suggestions.length > 0) && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <i
            className="close-icon"
            role="button"
            aria-label="Remove text"
            onClick={() => clear()}
          />
        )}
      </div>
      {suggestions.length > 0 && (
        <div className="suggestions">{renderSuggestions()}</div>
      )}
    </div>
  );
};

export default Typeahead;
