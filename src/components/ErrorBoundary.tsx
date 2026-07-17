import { Component, type ErrorInfo, type ReactNode } from "react";
import { PrimaryButton } from "@/components/atoms/buttons/primaryButton";
import { PrimaryTypo } from "@/components/atoms/typo/primaryTypo";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Unhandled application error:", error, info.componentStack);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-24 bg-app-surface px-24 text-center">
          <PrimaryTypo
            typo="Something went wrong"
            styles="!text-[24px] poppins-semibold text-[#8B1A1A]"
          />
          <p className="max-w-md text-sm text-app-muted">
            An unexpected error occurred. Please try again or return to the home
            page.
          </p>
          <PrimaryButton
            typo="Back to Home"
            handleOnClick={this.handleRetry}
            styles="!w-auto px-32"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
