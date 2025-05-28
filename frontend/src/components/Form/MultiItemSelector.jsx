import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

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

function getStyles(option, selectedOptions, theme) {
	return {
		fontWeight: selectedOptions.includes(option)
			? theme.typography.fontWeightMedium
			: theme.typography.fontWeightRegular
	};
}

export default function MultipleSelectChip({
	id,
	label,
	options,
	emptyOption = false
}) {
	const theme = useTheme();
	const [selectedOptions, setSelectedOptions] = React.useState([]);

	const handleChange = event => {
		const { target: { value } } = event;
		setSelectedOptions(
			// On autofill we get a stringified value.
			typeof value === "string" ? value.split(",") : value
		);
	};

	return (
		<div>
			<FormControl sx={{width: "100%" }}>
				<InputLabel id={`${id}-label`}>
					{label}
				</InputLabel>
				<Select
					labelId={`${id}-label`}
					id={id}
					multiple
					value={selectedOptions}
					onChange={handleChange}
					input={<OutlinedInput id={id} label={label} />}
					renderValue={selected =>
						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								gap: 0.5
							}}
						>
							{selected.map(value =>
								<Chip key={value} label={options.find(option => option.value === value)?.label} />
							)}
						</Box>}
					MenuProps={MenuProps}
				>
					{options.map(option => {
					
						return (
							<MenuItem
								key={option.value}
								value={option.value}
								style={getStyles(
									option.value,
									selectedOptions,
									theme
								)}
							>
								{option.label}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
		</div>
	);
}
