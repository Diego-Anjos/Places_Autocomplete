import { useState, useRef, useEffect, useId } from 'react';
import { useNominatim } from '../../hooks/useNominatim';
import type { NominatimResult } from '../../hooks/useNominatim';
import styles from './AddressAutocomplete.module.css';

interface AddressAutocompleteProps {
  label?: string;
  placeholder?: string;
  onSelect?: (result: NominatimResult) => void;
}

export function AddressAutocomplete({
  label = 'Endereço',
  placeholder = 'Digite um endereço...',
  onSelect,
}: AddressAutocompleteProps) {
  const inputId = useId();
  const listboxId = useId();

  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { results, isLoading, error } = useNominatim(inputValue);

  const showDropdown = isOpen && inputValue.trim().length >= 3;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset active index whenever results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  const handleSelect = (result: NominatimResult) => {
    setInputValue(result.display_name);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect?.(result);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          handleSelect(results[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setInputValue('');
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <span className={styles.searchIcon} aria-hidden="true">
          {isLoading ? (
            <span className={styles.spinner} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </span>

        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `option-${activeIndex}` : undefined}
          className={styles.input}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {inputValue && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Limpar endereço"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Sugestões de endereço"
          className={styles.dropdown}
        >
          {isLoading && (
            <li className={styles.statusItem}>
              <span className={styles.spinner} />
              <span>Buscando endereços...</span>
            </li>
          )}

          {!isLoading && error && (
            <li className={styles.statusItem} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </li>
          )}

          {!isLoading && !error && results.map((result, index) => (
            <li
              key={result.place_id}
              id={`option-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              className={`${styles.option} ${activeIndex === index ? styles.optionActive : ''}`}
              onMouseDown={(e) => {
                // Prevent input blur before click registers
                e.preventDefault();
                handleSelect(result);
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className={styles.optionIcon} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span className={styles.optionText}>{result.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
