export type WriteState = {
  fileinputError: string;
  forminputError: string;
  form: {
    file: File | null;
    textinput: string;
    textinputError: string;
  };
  formIsSubmitting: boolean;
};

type WriteAction =
  | { type: 'file_change_valid'; payload: File }
  | { type: 'file_change_invalid'; payload: string }
  | { type: 'file_change_reset' }
  | { type: 'file_inputerror_reset' }
  | { type: 'form_change'; payload: string }
  | { type: 'submit_form' }
  | { type: 'submit_form_success' }
  | { type: 'submit_form_error'; payload: string };

export const writeReducer = (state: WriteState, action: WriteAction): WriteState => {
  switch (action.type) {
    case 'file_change_valid':
      return {
        ...state,
        form: {
          ...state.form,
          file: action.payload,
        },
      };
    case 'file_change_invalid':
      return {
        ...state,
        form: {
          ...state.form,
          file: null,
        },
        fileinputError: action.payload,
      };
    case 'file_change_reset':
      return {
        ...state,
        form: {
          ...state.form,
          file: null,
        },
        fileinputError: '',
      };
    case 'file_inputerror_reset':
      return {
        ...state,
        fileinputError: '',
      };
    case 'form_change':
      return {
        ...state,
        form: {
          ...state.form,
          textinput: action.payload,
        },
      };
    case 'submit_form':
      return {
        ...state,
        formIsSubmitting: true,
      };
    case 'submit_form_success':
      return {
        ...state,
        formIsSubmitting: false,
        form: {
          file: null,
          textinput: '',
          textinputError: '',
        },
      };
    case 'submit_form_error':
      return {
        ...state,
      };
    default:
      throw new Error(`Unknown action type`);
  }
};
