import React, { useLayoutEffect, useMemo, useRef, useState } from "react";

import "./style.css";

interface Props
    extends React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    suggestions: string[];
    isLoading: boolean;
    label: string;
    onSelectSuggestion: (suggestion: string) => void;
}

const Autocomplete = React.memo(
    ({
        suggestions,
        isLoading,
        label,
        onSelectSuggestion,
        ...inputProps
    }: Props) => {
        const _value = inputProps.value?.toString() ?? "";
        const [suggestionCursor, setSuggestionCursor] = useState<number>(-1);
        const [hasSelectedSuggestion, setHasSelectedSuggestion] =
            useState<boolean>(false);
        const highlightedRef = useRef<HTMLLIElement | null>(null);
        // If the current _value is exactly the same as the item to which the
        //    cursor is pointing at in the suggestions list, we can assume that the
        //    user has selected an item and therefore hide the suggestions list cause
        //    our user longer needs it.
        const filteredSuggestions = suggestions.filter((w) =>
            w.includes(_value)
        );

        const preventMoveCursorToStart = (
            e: React.KeyboardEvent<HTMLInputElement>
        ): void => {
            if (e.key === "ArrowUp") {
                e.preventDefault();
            }
        };

        const scrollIntoView = (): void => {
            if (highlightedRef.current != null) {
                highlightedRef.current.scrollIntoView();
            }
        };

        const handleSelectSuggestion = (suggestion: string): void => {
            setHasSelectedSuggestion(true);
            onSelectSuggestion(suggestion);
        };

        const handleKeyDown = (
            e: React.KeyboardEvent<HTMLDivElement>
        ): void => {
            switch (e.key) {
                case "Enter": {
                    // Means that the user did not navigate through the results
                    // therefore we set the first result in the suggestion list
                    // as the selected suggestion cause it probably returned
                    // a single item
                    if (
                        suggestionCursor < 0 &&
                        filteredSuggestions.length > 0
                    ) {
                        handleSelectSuggestion(filteredSuggestions.at(0) ?? "");
                        setSuggestionCursor(0);
                        return;
                    }

                    const suggestionAtIndex =
                        filteredSuggestions[suggestionCursor] ?? 0;
                    handleSelectSuggestion(suggestionAtIndex);
                    break;
                }

                case "ArrowUp": {
                    setSuggestionCursor((oldValue) =>
                        oldValue - 1 < 0
                            ? filteredSuggestions.length - 1
                            : oldValue - 1
                    );
                    break;
                }

                case "ArrowDown": {
                    setSuggestionCursor((oldValue) =>
                        oldValue < filteredSuggestions.length - 1
                            ? oldValue + 1
                            : 0
                    );
                    break;
                }

                default: {
                    setHasSelectedSuggestion(false);
                    break;
                }
            }
        };

        useLayoutEffect(() => {
            if (filteredSuggestions.length === 1) {
                setSuggestionCursor(0);
            }

            scrollIntoView();
        }, [setSuggestionCursor, suggestionCursor, filteredSuggestions]);

        const suggestionItems = useMemo(
            () =>
                filteredSuggestions.map((w, idx) => {
                    const [before, after] = w.split(_value);

                    return (
                        <li
                            key={w}
                            role="button"
                            onClick={() => {
                                handleSelectSuggestion(w);
                                setSuggestionCursor(idx);
                            }}
                            {...((suggestionCursor === idx && {
                                style: {
                                    backgroundColor: "lightskyblue",
                                },
                            }) ??
                                {})}
                            ref={
                                suggestionCursor === idx ? highlightedRef : null
                            }
                        >
                            {before}
                            {_value.length > 0 ? (
                                <span style={{ fontWeight: "bolder" }}>
                                    {_value}
                                </span>
                            ) : null}
                            {after}
                        </li>
                    );
                }),
            [
                filteredSuggestions,
                _value,
                setSuggestionCursor,
                onSelectSuggestion,
            ]
        );

        return (
            <div className="autocomplete-container" onKeyDown={handleKeyDown}>
                <label htmlFor={inputProps.id}>{label}</label>
                <input
                    autoComplete="off"
                    {...inputProps}
                    onKeyDown={preventMoveCursorToStart}
                />
                {_value.length > 0 && !hasSelectedSuggestion ? (
                    <ul>
                        {isLoading ? <li>Loading...</li> : null}
                        {!isLoading && suggestionItems.length === 0 ? (
                            <li>No results found</li>
                        ) : null}
                        {!isLoading ? suggestionItems : null}
                    </ul>
                ) : null}
            </div>
        );
    }
);

Autocomplete.displayName = "Autocomplete";

export default Autocomplete;
