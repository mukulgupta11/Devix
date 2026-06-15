import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface AISuggestionsState {
  suggestion: string | null;
  isLoading: boolean;
  position: { line: number; column: number } | null;
  decoration: string[];
  isEnabled: boolean;
}

interface UseAISuggestionsReturn extends AISuggestionsState {
  toggleEnabled: () => void;
  fetchSuggestion: (type: string, editor: any) => Promise<void>;
  acceptSuggestion: (editor: any, monaco: any) => void;
  rejectSuggestion: (editor: any) => void;
  clearSuggestion: (editor: any) => void;
}

export const useAISuggestions = (): UseAISuggestionsReturn => {
  const [state, setState] = useState<AISuggestionsState>({
    suggestion: null,
    isLoading: false,
    position: null,
    decoration: [],
    isEnabled: true,
  });
  const enabledRef = useRef(true);
  const requestRef = useRef<AbortController | null>(null);

  const toggleEnabled = useCallback(() => {
    setState((previous) => {
      const isEnabled = !previous.isEnabled;
      enabledRef.current = isEnabled;
      if (!isEnabled) requestRef.current?.abort();
      return {
        ...previous,
        isEnabled,
        isLoading: false,
        suggestion: isEnabled ? previous.suggestion : null,
        position: isEnabled ? previous.position : null,
      };
    });
  }, []);

  const fetchSuggestion = useCallback(async (type: string, editor: any) => {
    if (!enabledRef.current || !editor) return;
    const model = editor.getModel();
    const cursorPosition = editor.getPosition();
    if (!model || !cursorPosition) return;

    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setState((previous) => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch("/api/code-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          fileContent: model.getValue(),
          cursorLine: cursorPosition.lineNumber - 1,
          cursorColumn: cursorPosition.column - 1,
          suggestionType: type,
          fileName: model.uri?.path?.split("/").pop(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "AI suggestion failed");
      }

      const suggestion = String(data.suggestion || "").trim();
      setState((previous) => ({
        ...previous,
        suggestion: suggestion || null,
        position: suggestion
          ? {
              line: cursorPosition.lineNumber,
              column: cursorPosition.column,
            }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      console.error("Error fetching code suggestion:", error);
      setState((previous) => ({ ...previous, isLoading: false }));
      toast.error("AI suggestion is unavailable right now");
    }
  }, []);

  const clearSuggestion = useCallback((editor: any) => {
    setState((currentState) => {
      if (editor && currentState.decoration.length > 0) {
        editor.deltaDecorations(currentState.decoration, []);
      }
      return {
        ...currentState,
        suggestion: null,
        position: null,
        decoration: [],
      };
    });
  }, []);

  // PlaygroundEditor performs the insertion. This callback only clears shared state.
  const acceptSuggestion = useCallback(
    (editor: any) => {
      clearSuggestion(editor);
    },
    [clearSuggestion]
  );

  const rejectSuggestion = useCallback(
    (editor: any) => {
      clearSuggestion(editor);
    },
    [clearSuggestion]
  );

  return {
    ...state,
    toggleEnabled,
    fetchSuggestion,
    acceptSuggestion,
    rejectSuggestion,
    clearSuggestion,
  };
};
