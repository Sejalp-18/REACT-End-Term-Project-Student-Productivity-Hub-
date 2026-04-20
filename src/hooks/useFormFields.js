import { useCallback, useState } from "react";

export function useFormFields(initialState) {
  const [fields, setFields] = useState(initialState);

  const updateField = useCallback((event) => {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  }, []);

  const resetFields = useCallback(() => {
    setFields(initialState);
  }, [initialState]);

  const setAllFields = useCallback((nextState) => {
    setFields(nextState);
  }, []);

  return {
    fields,
    updateField,
    resetFields,
    setAllFields,
  };
}
