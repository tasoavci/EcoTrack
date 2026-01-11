interface InputErrorProps {
    message?: string | string[];
    className?: string;
}

export default function InputError({
    message,
    className = "",
    ...props
}: InputErrorProps & React.HTMLAttributes<HTMLParagraphElement>) {
    return message ? (
        <p {...props} className={"text-sm text-red-600 " + className}>
            {message}
        </p>
    ) : null;
}
