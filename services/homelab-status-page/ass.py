#!/usr/bin/env python3

def parse_file_to_dict(filename):
    result = {}
    current_key = None

    with open(filename, 'r') as file:
        for line in file.readlines():
            line = line.strip()
            if line.isdigit():
                current_key = int(line)
                result[current_key] = []
            elif line:
                result[current_key].append(line)

    return result

def format_output(data):
    output = "{"
    for key, values in data.items():
        output += f"{key}: [\n"
        for value in values:
            output += f'"{value}",\n'
        output = output.rstrip(',\n') + "\n], \n"
    output = output.rstrip(', \n') + "}"
    return output

# Example usage
filename = 'go-output.json'
parsed_data = parse_file_to_dict(filename)
formatted_output = format_output(parsed_data)
print(formatted_output)
