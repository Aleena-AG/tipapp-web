import * as Yup from "yup";
import { isValidPhoneNumber } from "./phone";

export const editProfileValidationSchema = Yup.object().shape({
  // Username: Yup.string()
  //   .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain alphabets, numbers, and underscores.")
  //   .min(3, "Username must be at least 3 characters")
  //   .max(50, "Username can't be more than 50 characters")
  //   .required("Username is required"),

  FirstName: Yup.string()
    // Only letters, no spaces or numbers allowed
    .matches(
      /^[A-Za-z]+$/,
      "First name should contain only alphabets (A-Z or a-z) and no spaces or numbers"
    )
    .min(1, "First name must be at least 1 character")
    .max(50, "First name can't be more than 50 characters")
    .required("First Name is required"),

  LastName: Yup.string()
    // Allow letters, spaces and hyphens, but require at least one alphabet (no spaces-only)
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z\s-]+$/,
      "Last name should contain only alphabets, spaces or hyphens and cannot be only spaces"
    )
    .min(1, "Last name must be at least 1 character")
    .max(50, "Last name can't be more than 50 characters")
    .required("Last Name is required"),

  // DateOfBirth: Yup.date()
  //   .required("Date of Birth is required")
  //   .max(new Date(), "Date of Birth cannot be in the future")
  //   .test(
  //     "age-validation",
  //     "You must be at least 18 years old to use this service",
  //     (value) => {
  //       if (!value) return false;
  //       const today = new Date();
  //       const birthDate = new Date(value);
  //       let age = today.getFullYear() - birthDate.getFullYear();
  //       const monthDiff = today.getMonth() - birthDate.getMonth();

  //       if (
  //         monthDiff < 0 ||
  //         (monthDiff === 0 && today.getDate() < birthDate.getDate())
  //       ) {
  //         age--;
  //       }

  //       return age >= 18;
  //     }
  //   ),

  Email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  Address: Yup.string()
    .max(200, "Address can't be more than 200 characters")
    .required("Address is required"),

  Phone: Yup.string()
    .test(
      "is-phone",
      "Invalid phone number",
      (value) => isValidPhoneNumber(value)
    )
    .required("Phone number is required"),

  Country: Yup.string()
    // Only letters and spaces allowed, but not spaces-only
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z\s]+$/,
      "Country should contain only alphabets and cannot be blank spaces"
    )
    .min(1, "Country must be at least 1 character")
    .max(50, "Country can't be more than 50 characters")
    .required("Country is required"),

  City: Yup.string()
    // Only letters and spaces allowed, but not spaces-only
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z\s]+$/,
      "City should contain only alphabets and cannot be blank spaces"
    )
    .min(1, "City must be at least 1 character")
    .max(50, "City can't be more than 50 characters")
    .required("City is required"),
  Bio: Yup.string().max(250, "Bio cannot exceed 250 characters").optional(),
  Paypal: Yup.string().email("Please enter a valid email address").nullable(),
});

export const generateRegistrationValidationSchema = (
  showBankDetails: boolean
) => {
  const baseSchema = Yup.object({
    // Username: Yup.string()
    //   .matches(/^[^\s]*$/, "Username should not contain spaces")
    //   .matches(
    //     /^[A-Za-z0-9_]+$/,
    //     "Username should contain only alphabets, numbers, and underscores"
    //   )
    //   .min(3, "Username must be at least 3 characters")
    //   .max(50, "Username can't be more than 50 characters")
    //   .required("Required"),
    FirstName: Yup.string()
      // Only letters, no spaces or numbers allowed
      .matches(
        /^[A-Za-z]+$/,
        "First name should contain only alphabets (A-Z or a-z) and no spaces or numbers"
      )
      .min(1, "First name must be at least 1 character")
      .max(50, "First name can't be more than 50 characters")
      .required("Required"),
    LastName: Yup.string()
      // Allow letters, spaces and hyphens, but require at least one alphabet (no spaces-only)
      .matches(
        /^(?=.*[A-Za-z])[A-Za-z\s-]+$/,
        "Last name should contain only alphabets, spaces or hyphens and cannot be only spaces"
      )
      .min(1, "Last name must be at least 1 character")
      .max(50, "Last name can't be more than 50 characters")
      .required("Required"),
    Address: Yup.string()
      .max(200, "Address can't be more than 200 characters")
      .required("Required"),
    Phone: Yup.string()
      .test(
        "is-phone",
        "Invalid phone number",
        (value) => isValidPhoneNumber(value)
      )
      .required("Required"),
    // DateOfBirth: Yup.date()
    //   .required("Date of Birth field is required")
    //   .test(
    //     "DOB",
    //     "Date of Birth cannot be in the future",
    //     (value) => value && new Date(value) <= new Date()
    //   )
    //   .test(
    //     "age-validation",
    //     "You must be at least 18 years old to use this service",
    //     (value) => {
    //       if (!value) return false;
    //       const today = new Date();
    //       const birthDate = new Date(value);
    //       let age = today.getFullYear() - birthDate.getFullYear();
    //       const monthDiff = today.getMonth() - birthDate.getMonth();

    //       if (
    //         monthDiff < 0 ||
    //         (monthDiff === 0 && today.getDate() < birthDate.getDate())
    //       ) {
    //         age--;
    //       }

    //       return age >= 18;
    //     }
    //   ),
    Whatsapp: Yup.string()
      .test(
        "is-phone",
        "Invalid WhatsApp number",
        (value) => !value || isValidPhoneNumber(value)
      )
      .optional(),
    Country: Yup.string()
      // Only letters and spaces allowed, but not spaces-only
      .matches(
        /^(?=.*[A-Za-z])[A-Za-z\s]+$/,
        "Country should contain only alphabets and cannot be blank spaces"
      )
      .min(1, "Country must be at least 1 character")
      .max(50, "Country can't be more than 50 characters")
      .required("Required"),
    City: Yup.string()
      // Letters, spaces and hyphens (e.g. Stoke-on-Trent), but not spaces-only
      .matches(
        /^(?=.*[A-Za-z])[A-Za-z\s-]+$/,
        "City should contain only alphabets, spaces or hyphens and cannot be blank spaces"
      )
      .min(1, "City must be at least 1 character")
      .max(50, "City can't be more than 50 characters")
      .required("Required"),
    Bio: Yup.string().max(250, "Bio cannot exceed 250 characters").optional(),
  });

  if (showBankDetails) {
    return baseSchema.shape({
      // bankName: Yup.string()
      //   .matches(
      //     /^[A-Za-z\s]+$/,
      //     "Bank name should contain only alphabets and spaces"
      //   )
      //   .max(100, "Bank name can't be more than 100 characters")
      //   .required("Required"),
      // // Conditionally require accountNumber OR ibanNumber based on country
      // accountNumber: Yup.string().when("countryCode", {
      //   is: "US",
      //   then: (schema) => schema.required("Account number is required for US accounts"),
      //   otherwise: (schema) => schema.notRequired(),
      // }),
      // ibanNumber: Yup.string().when("countryCode", {
      //   is: (val: string) => val !== "US", // For non-US countries
      //   then: (schema) =>
      //     schema
      //       .matches(
      //         /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/,
      //         "Invalid IBAN format, Here is an example: DE89370400440532013000"
      //       )
      //       .required("IBAN is required for non-US accounts"),
      //   otherwise: (schema) => schema.notRequired(),
      // }),
      // CountryCode: Yup.string().required("Country is required"),
      // paypal: Yup.string()
      //   .email("Should be a valid email format")
      //   .max(100, "PayPal email can't be more than 100 characters")
      //   .required("Required"),
    });
  }

  return baseSchema;
};
