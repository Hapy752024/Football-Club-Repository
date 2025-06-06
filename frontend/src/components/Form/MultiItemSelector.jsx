import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { FormHelperText } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
};

export default function MultiItemSelector({
	id,
	label,
	name,
	value,
	options,
	onChange,
	onBlur,
	error,
	helperText
}) {
	const theme = useTheme();

	return (
		<div>
			<FormControl sx={{ width: "100%" }}>
				<InputLabel id={`${id}-label`}>{label}</InputLabel>
				<Select
					labelId={`${id}-label`}
					id={id}
					name={name}
					label={label}
					multiple
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					error={error}
					input={
						<OutlinedInput
							id={id}
							label={label}
						/>
					}
					renderValue={(selected) => (
						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								gap: 0.5
							}}>
							{selected.map((value) => (
								<Chip
									key={value}
									label={
										options.find(
											(option) => option.value === value
										)?.label
									}
								/>
							))}
						</Box>
					)}
					MenuProps={MenuProps}>
					{options.map((option) => {
						return (
							<MenuItem
								key={option.value}
								value={option.value}>
								{option.label}
							</MenuItem>
						);
					})}
				</Select>
				{error && helperText ? (
					<FormHelperText error>{helperText}</FormHelperText>
				) : null}
			</FormControl>
		</div>
	);
}
