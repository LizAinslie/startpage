import type { FC } from "react";

export type FormErrorsProps = {
  errors: string[];
};
export const FormErrors: FC<FormErrorsProps> = ({ errors }) => {
  return (
    errors.length > 0 && (
      <ul className="form_errors">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    )
  );
};
