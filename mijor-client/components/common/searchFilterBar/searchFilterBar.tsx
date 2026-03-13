import SearchFilterBarDestop from "./searchFilterBarDestop";
import SearchFilterBarMobile from "./searchFilterBarMobile";

import { SearchFilterBarProps } from "./shared";

export default function SearchFilterBar({
    onSearch,
    onClear,
    onTitleChange,
    titleSuggestions,
    initialFilters,
    languageOptions,
    genreOptions,
    cityOptions,
    isShow,
}: SearchFilterBarProps) {
    return (
        <>
            <SearchFilterBarDestop
                onSearch={onSearch}
                onClear={onClear}
                onTitleChange={onTitleChange}
                titleSuggestions={titleSuggestions}
                initialFilters={initialFilters}
                languageOptions={languageOptions}
                genreOptions={genreOptions}
                cityOptions={cityOptions}
                isShow={isShow}
            />

            <SearchFilterBarMobile
                onSearch={onSearch}
                onClear={onClear}
                onTitleChange={onTitleChange}
                titleSuggestions={titleSuggestions}
                initialFilters={initialFilters}
                languageOptions={languageOptions}
                genreOptions={genreOptions}
                cityOptions={cityOptions}
                isShow={isShow}
            />
        </>
    );
}