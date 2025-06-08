import { ChangeEvent, useState, InputHTMLAttributes } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelclassName?: string;
  inputclassName?: string;
}

const Input = ({
  value,
  onChange,
  label,
  placeholder,
  type,
  labelclassName,
  inputclassName,
  ...rest
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label
        className={`text-xs md:text-[16px] text-slate-800 ${labelclassName}`}
      >
        {label}
      </label>
      <div className={`input-box ${inputclassName}`}>
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          className="w-full h-full outline-none placeholder:text-xs placeholder:md:text-[16px]"
          {...rest} // Forward all other props like max, min, etc.
        />
        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                onClick={toggleShowPassword}
                className="text-primary cursor-pointer"
              />
            ) : (
              <FaRegEyeSlash
                onClick={toggleShowPassword}
                size={22}
                className="text-primary cursor-pointer"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;