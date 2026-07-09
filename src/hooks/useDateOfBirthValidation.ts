
export interface DateOfBirthValidationResult {
  isValid: boolean;
  errorMessage: string;
  age: number;
}

export const useDateOfBirthValidation = () => {
  const validateDateOfBirth = (
    dateOfBirth: string
  ): DateOfBirthValidationResult => {
    // Check if date is provided
    if (!dateOfBirth || dateOfBirth.trim() === "") {
      return {
        isValid: false,
        errorMessage: "Date of Birth field is required",
        age: 0,
      };
    }

    // Parse the date
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    // Check if the date is valid
    if (isNaN(birthDate.getTime())) {
      return {
        isValid: false,
        errorMessage: "Please enter a valid date",
        age: 0,
      };
    }

    // Check if the date is not in the future
    if (birthDate > today) {
      return {
        isValid: false,
        errorMessage: "Date of birth cannot be in the future",
        age: 0,
      };
    }

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Check if user is at least 18 years old
    if (age < 18) {
      return {
        isValid: false,
        errorMessage: "You must be at least 18 years old to use this service",
        age,
      };
    }

    // Check if age is reasonable (not more than 120 years)
    if (age > 120) {
      return {
        isValid: false,
        errorMessage: "Please enter a valid date of birth",
        age,
      };
    }

    return {
      isValid: true,
      errorMessage: "",
      age,
    };
  };

  const getMaxDate = (): string => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return maxDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const getMinDate = (): string => {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 120,
      today.getMonth(),
      today.getDate()
    );
    return minDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  return {
    validateDateOfBirth,
    getMaxDate,
    getMinDate,
    formatDateForDisplay,
    formatDateForInput,
  };
};

export default useDateOfBirthValidation;
