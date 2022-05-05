import React from "react";

interface User {
	username: "string";
}

export const UserListItem: React.FC<User> = (user) => {
	return <li>content</li>
}
