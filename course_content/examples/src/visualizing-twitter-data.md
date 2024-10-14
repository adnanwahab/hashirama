# Visualizing Twitter data 🐦
<figcaption>[Twitter Starter Pack](https://observablehq.com/@floatingpurr/twitter-starter) > Connect the visualizations</figcaption>

This notebook provides a few visualization examples focusing on data about a **Twitter account** and **related tweets**.

> 💾 _Do you want to load your [own Twitter data](#load)?_
>
> 📚 Read the [documentation](https://observablehq.com/@floatingpurr/twitter-starter).
>
> 👉 this notebook makes an extensive use of **dates** and **times**. Type-in here below the timezone you want to use for visualizing dates and times.


```js
viewof timezone = Inputs.text({
  label: "Timezone",
  placeholder: "Enter a timezone",
  datalist: timezoneList,
  value: Intl.DateTimeFormat().resolvedOptions().timeZone, // get the system's IANA timezone of the client
  validate: (d) => timezoneList.includes(d.value),
  submit: "Set 🕰 "
})
```

```js
toc({
  headers: "h2,h3",
})
```

## 👤 Analyzing the user profile: _${profile.name}_
<figcaption>Data retrieved from Twitter on: ${d3.timeFormat('%Y-%m-%d h %H:%M')(convertTZ(twitter.data_timestamp))} (${timezone})</figcaption>

<img src="${profile.profile_image_url.replace("_normal","")}" style = "border-radius: 50%; width:${width/5}px" alt="${profile.name}">

- 👤  _User_: **${profile.name}** (*@${profile.username}*) ${ profile.verified ? svg`<svg width="24" height="24" viewBox="0 0 24 24"><title>Verified Account</title><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5c-1.51 0-2.816.917-3.437 2.25-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" fill="currentColor"></path></svg>`: '' }
- 📊  _Metrics_: **${numberFormatter.format(profile.public_metrics.followers_count)}** followers | **${numberFormatter.format(profile.public_metrics.following_count)}** following | **${numberFormatter.format(profile.public_metrics.tweet_count)}** tweets | **${numberFormatter.format(profile.public_metrics.listed_count)}** listed
- 🗓️ _Joined_: ${profile.created_at ? d3.timeFormat('%Y-%m-%d h %H:%M')(profile.created_at) : 'n/a'}
- ℹ️ _Bio_: ${profile.description ? profile.description : 'n/a'}
- 📍 _Location_: ${profile.location ? profile.location : 'n/a'}




```js
profile.pinned_tweet_id ? md`<details><summary>📌 Show pinned tweet: </summary>${tweet(profile.pinned_tweet_id)}</details>`: md`No pinned Tweet`
```

## 📣 The tweet list (aka the Timeline)

The following cells host visualizations about the tweet collection (aka the Timeline) of _${profile.name}_.

In this dataset, there are _${tweets.length}_ items, i.e., tweets (**T**) and retweets (**RT**), following [this data format](#format). Have a look:

```js
viewof search = Inputs.search(tweets, {placeholder: "Search Tweets..."})
```

```js
viewof selectedTweet = Inputs.table(search, {
  multiple: false,
  columns: ["type", "created_at", "text", "retweet_count", "reply_count", "like_count", "quote_count", "hashtags", "mentions", "emojis"]
})
```

```js
{ 
  if (selectedTweet) {
    return tweet(selectedTweet.id);
  }

  return md`👆_Select a tweet from the table to display it!_`

}
```

## 🔁 Tweet-Retweet view

Retweet (**RT**) *vs.* Tweet (**T**) proportion:

```js
Plot.plot({
  marginLeft: 40,
  x: {
    percent: true
  },
  marks: [
    Plot.barX(tweets, Plot.stackX(Plot.groupZ({x: "proportion"}, {fill: "type"}))),
    Plot.text(tweets, Plot.stackX(Plot.groupZ({x: "proportion", text: "first"}, {z: "type", text: "type"}))),
    Plot.ruleX([0, 1])
  ]
})
```

This is the time distribution of the items (**RT** + **T**):

```js
addTooltips(
  Plot.plot({
  grid: true,
  inset: 10,
  width: width,
  facet: {
    data: tweets,
    marginLeft: 40,
  },
  marks: [
    Plot.frame(),
    Plot.dot(tweets, {
      x: "created_at",
      fill: "black",
      fillOpacity: tweets.length < 50 ? 0.8 : .05,
      title: "text"
    })
  ]
})
  )
```

Same distribution but separating **RT**s from **T**s:

```js
signals = addTooltips(
  Plot.plot({
  grid: true,
  inset: 10,
  width: width,
  facet: {
    data: tweets,
    y: "type",
  },
  marks: [
    Plot.frame(),
    Plot.dot(tweets, {
      x: "created_at",
      fill: "type",
      fillOpacity: tweets.length < 50 ? 0.8 : .05,
      title: "text"
    })
  ]
})
)
```

## 🗓 Calendar view
<figcaption>Inspired by [this amazing Calendar View](https://observablehq.com/@d3/calendar-view)</figcaption>

The following calendar view shows with an heatmap the daily activity of _${profile.name}_ on Twitter.

```js
calendar = {
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height * years.length])
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

  const year = svg.selectAll("g")
    .data(years)
    .join("g")
      .attr("transform", (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`);

  year.append("text")
      .attr("x", -5)
      .attr("y", -5)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text(([key]) => key);

  year.append("g")
      .attr("text-anchor", "end")
    .selectAll("text")
    .data(weekday === "weekday" ? d3.range(1, 6) : d3.range(7))
    .join("text")
      .attr("x", -5)
      .attr("y", i => (countDay(i) + 0.5) * cellSize)
      .attr("dy", "0.31em")
      .text(formatDay);

  year.append("g")
    .selectAll("rect")
    .data(weekday === "weekday"
        ? ([, values]) => values.filter(d => ![0, 6].includes(d.date.getDay()))
        : ([, values]) => values)
    .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", d => timeWeek.count(d3.timeYear(d.date), d.date) * cellSize + 0.5)
      .attr("y", d => countDay(d.date.getDay()) * cellSize + 0.5)
      .attr("fill", d => color(d.value))
    .append("title")
      .text(d => `${d3.timeFormat('%Y-%m-%d')(d.date)}\n${d.value} items`)

  const month = year.append("g")
    .selectAll("g")
    .data(([, values]) => d3.timeMonths(d3.timeMonth(values[0].date), values[values.length - 1].date))
    .join("g");

  month.filter((d, i) => i).append("path")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("d", pathMonth);

  month.append("text")
      .attr("x", d => timeWeek.count(d3.timeYear(d), timeWeek.ceil(d)) * cellSize + 2)
      .attr("y", -5)
      .text(formatMonth);

  return svg.node();
}
```

```js
key = legend({color, title: "Activity per day"})
```

#### 🕹 Tweak the calendar view

```js
viewof filterRadio = Inputs.radio(["Tweets (T)", "Retweets (RT)", "Both"], {value: "Both", label: "Filter activity:"})
```

```js
viewof scale = Inputs.radio(scales, {
  label: "Color scale", 
  value: d3.scaleSequential,
  format: x => x.text,
  valueof: (v) =>  v.value
})
```

```js
viewof weekday = Inputs.select(calendarViews, {
  label: "Week type", 
  value: "monday",
  format: x => x.text,
  valueof: (v) =>  v.value
})
```

## 🕤 Time view

This heatmap exhibits the hourly activity per each weekday of _${profile.name}_ on Twitter.

```js
time = {
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, heightTime])
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

  const week = svg
     .append("g")
      .attr("transform", `translate(40.5,${cellSizeTime * 1.5})`);

  // title
  week.append("text")
      .attr("x", -5)
      .attr("y", -5)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text("week");

  // weekdays part 1
  week.append("g")
      .attr("text-anchor", "end")
    .selectAll("text")
    .data(weekday === "weekday" ? d3.range(1, 6) : d3.range(7))
    .join("text")
      .attr("x", -5)
      .attr("y", i => (countDay(i) + 0.5) * cellSizeTime)
      .attr("dy", "0.31em")
      .text(formatDay);

  // weekdays part 2
  week.append("g")
    .selectAll("rect")
    .data(weekday === "weekday"
        ? (weekDays.filter(d => ![0, 6].includes(d[0])))
        : weekDays)
    .join("rect")
      .attr("width", cellSizeTime - 1)
      .attr("height", cellSizeTime - 1)
      .attr("x", d => d[1] * cellSizeTime + 0.5)
      .attr("y", d => countDay(d[0]) * cellSizeTime + 0.5)
      .attr("rx", 3)
      .attr("fill", d => colorWeek(d[2]))
    .append("title")
      .text(d => `day: ${formatDay(d[0])}\nfrom ${d[1]}:00 to ${d[1]}:59\n${d[2]} items`)

  const hour = week.append("g")
    .selectAll("g")
    .data(d3.range(2, 25, 2))
    .join("g");

  hour.append("text")
    .attr("x", d => d * cellSizeTime)
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .text(d => d);

  return svg.node();
}
```

```js
keyWeek = legend({color: colorWeek, title: "Activity per hour"})
```

#### 🕹 Tweak the time view

```js
Inputs.bind(Inputs.text({
  label: "Change Timezone",
  placeholder: "Enter a timezone",
  datalist: timezoneList,
  value: Intl.DateTimeFormat().resolvedOptions().timeZone, // get the system's IANA timezone of the client
  validate: (d) => timezoneList.includes(d.value),
  submit: "Set 🕰 "
}), viewof timezone)
```

```js
Inputs.bind(Inputs.radio(["Tweets (T)", "Retweets (RT)", "Both"], {value: "Both", label: "Filter activity:"}), viewof filterRadio)
```

```js
viewof scale2 = Inputs.radio(scales, {
  label: "Color scale", 
  value: d3.scaleSequential,
  format: x => x.text,
  valueof: (v) =>  v.value
})
```

```js
Inputs.bind(Inputs.select(calendarViews, {
  label: "Week type", 
  value: "monday",
  format: x => x.text,
  valueof: (v) =>  v.value
}), viewof weekday)
```

## ＃ Hashtag view

Hashtags are the first-class tagging system of Twitter. The following **#barChart** (just joking 😅) represents their usage by _${profile.name}_.

```js
Plot.plot(setPlot({values: hashtags, color: "#5ab0d1"}, {name: "hashtags", rotation: -45}, hashSlider))
```

#### 🕹 Tweak the hashtag view

```js
viewof hashSlider = rangeSlider(setSlider(hashtags, "hashtags"))
```

```js
Inputs.bind(Inputs.radio(["Tweets (T)", "Retweets (RT)", "Both"], {value: "Both", label: "Filter activity:"}), viewof filterRadio)
```

## 😎 Emoji view

🐱 🤌 💙 🤩 ！ How does _${profile.name}_ use emojis on Twitter? Check out the 📊:

```js
Plot.plot(setPlot({values:emojis, color: "#afe4b8"}, {name: "Emojis", rotation: 0}, emojiSlider))
```

#### 🕹 Tweak the emoji view

```js
viewof emojiSlider = rangeSlider(setSlider(emojis, "emojis"))
```

```js
Inputs.bind(Inputs.radio(["Tweets (T)", "Retweets (RT)", "Both"], {value: "Both", label: "Filter activity:"}), viewof filterRadio)
```

## ＠ Mention view

And what about **@mentions**? Find here below how _${profile.name}_ interacts with other people on Twitter. 

> 👉 _Pssssst:_ mentions are affected also by replies and retweets (i.e., a reply to a user or a retweet of user's tweet counts as a mention)

```js
Plot.plot(setPlot({values:mentions, color: "#eb9c52"}, {name: "Mentions", rotation: -45}, mentionSlider))
```

#### 🕹 Tweak the mention view

```js
viewof mentionSlider = rangeSlider(setSlider(mentions, "mentions"))
```

```js
Inputs.bind(Inputs.radio(["Tweets (T)", "Retweets (RT)", "Both"], {value: "Both", label: "Filter activity:"}), viewof filterRadio)
```

```js
load = md`## ⬆️ Load your own data`
```

Do you want to explore a different Twitter account? You can upload other data! 🎉 

Just get your Twitter data file [from this notebook](https://observablehq.com/@floatingpurr/twitter-api), then upload it here below!

```js
// Load the data (e.g., a .csv file)
viewof rawdata = dataInput({
  initialValue: await FileAttachment("twitter.json").json()
})
```

⚠️ The button above triggers a convenient mechanism to load new data. **Such data are not preserved upon forks**. If you want to **fork this notebook with your data, replace the data file references with the data pane on the right, and then fork this notebook**.

```js
html`<figure>
  ${await FileAttachment("data pane.png").image()}
</figure>`
```

## Implementation and further information

Other details about this notebook.

```js
format = md`### More about the tweet data`
```

Each tweet (or item) is an Object with the following keys:

- `id`: the item identifier in Twitter
- `type`: the inferred item type, ie. Tweet (T) or Retweet (RT)
- `created_at`: the creation date and time of the item in a given [timezone](#timezone)
- `text`: the tweet text
- `retweet_count`: number of times the item has been retweeted
- `reply_count`: number of replies of this item
- `like_count`: number of likes of this item
- `quote_count`: number of times this item has been Retweeted with a comment (also known as Quote).
- `hashtags`: nullable list of #hashtags detected in the tweet
- `mentions`: nullable list of @mentions detected in the tweet
- `emojis`: nullable list of emojis detected in the tweet

Note: Retweets do not have metrics about replies, likes or quotes. Probably, this happens because such insights are related to the original Tweet. 

See also the [Twitter doc](https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-by-username-username-tweets).

### Data processing

```js
twitter = rawdata
```

```js echo
// Parse profile date
twitter.profile.created_at = new Date(twitter.profile.created_at)
```

```js
profile = twitter.profile
```

```js
tweets = twitter.tweets.map((d, i) => ({
  id: d.id,
  type: classifyTweet(d),
  created_at: convertTZ(d.created_at),
  text: d.text,
  retweet_count: d.public_metrics.retweet_count,
  reply_count: d.public_metrics.reply_count,
  like_count: d.public_metrics.like_count,
  quote_count: d.public_metrics.quote_count,
  hashtags: getEntities(d, 'hashtags'),
  mentions: getEntities(d, 'mentions'),
  emojis: d.text.match(emojiRegex)
}))
```

```js
data = tweets.filter((d) => {
  return filterRadio === 'Tweets (T)' ? d.type === 'T'
    : filterRadio === 'Retweets (RT)' ? d.type === 'RT'
    : true;
})
```

### Calendar view

```js
color = {
  //const max = d3.quantile(years, 0.80, ([,values]) => values[0][1].length);
  const max = d3.max(years, v => d3.max(v[1], d => d.value))
  return scale(d3.interpolateGreens).domain([0, max]);
}
```

```js
dateReducer = (d) => {
  // group tweets by date
  const groups = d3.groups(d, v => new Date(d3.timeFormat('%Y-%m-%d')(v.created_at.getTime()))).reverse();
  
  // count tweets per date
  return groups.map(([date,tweets]) => ({date: date, value: tweets.length}));
}
```

```js
years = d3.rollups(data, dateReducer, d => d.created_at.getFullYear()).reverse()
```

```js
years_details = d3.groups(data, d => d.created_at.getFullYear(), d => new Date(d3.timeFormat('%Y-%m-%d')(d.created_at.getTime()))).reverse()
```

```js
scales = [{value: d3.scaleSequential, text:"Linear"}, {value:d3.scaleSequentialSqrt, text:"Sqrt"}]
```

```js
height = cellSize * (weekday === "weekday" ? 7 : 9)
```

```js
countDay = weekday === "sunday" ? i => i : i => (i + 6) % 7
```

```js
formatDay = i => "SMTWTFS"[i]
```

```js
timeWeek = weekday === "sunday" ? d3.timeSunday : d3.timeMonday
```

```js
function pathMonth(t) {
  const n = weekday === "weekday" ? 5 : 7;
  const d = Math.max(0, Math.min(n, countDay(t.getDay())));
  const w = timeWeek.count(d3.timeYear(t), t);
  return `${d === 0 ? `M${w * cellSize},0`
      : d === n ? `M${(w + 1) * cellSize},0`
      : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${n * cellSize}`;
}
```

```js
formatMonth = d3.timeFormat("%b")
```

```js
calendarViews = [
  {value: "weekday", text: "Weekdays only"},
  {value: "sunday", text: "Sunday-based weeks"},
  {value: "monday", text: "Monday-based weeks"}
]
```

#### Cosmetic cell(s)

```js
cellSize = 15
```

### Time view

```js
heightTime = cellSizeTime * (weekday === "weekday" ? 7 : 9)
```

```js
weekDaysTweets = d3.rollups(
  data, 
  d => d3.groups(d, v => v.created_at.getHours()),
  d => countDay(d.created_at.getDay())
)
```

```js
weekDays = d3.flatRollup(data, v => v.length, d => d.created_at.getDay(), d => d.created_at.getHours())
```

```js
colorWeek = {
  //const max = d3.quantile(years, 0.80, ([,values]) => values[0][1].length);
  const max = d3.max(weekDays, d => d[2])
  return scale2(d3.interpolateBlues).domain([0, max]);
}
```

#### Cosmetic cell(s)

```js
cellSizeTime = 20
```

### Bar charts

```js
getBars = (items) => {
  const bars = data.reduce(function (acc, d) {

    if (d[items]) {
      d[items].forEach(v => {
        const item = acc.find(t => t.item === v);
        item ? (++item.value && item.tweets.push(d)) : acc.push({item: v, value: 1, tweets:[d]});
      }
                      );
    }

    return acc
  }, []);

  return bars.sort((a,b) => b.value - a.value)
}
```

```js
setPlot = (data, label, controller) => ({
  width: width,
  marginBottom: 100,
  x: {
    domain: d3.sort(data.values, d => -d.value).map(d => d.item).slice(controller[0] - 1, controller[1]),
    label: `${label.name} of ${profile.name}`,
    tickRotate: label.rotation
  },
  y: {
    grid: true
  },
  marks: [
    Plot.barY(data.values, {x: "item", y: "value", fill: data.color, title: d => `${d.item}: ${d.value}`}),
    Plot.ruleY([0]),
  ]
})
```

```js
setSlider = (data, label) => ({
  min: 1,
  max: data.length,
  step: 1,
  // Note that values must be specified as array of length 2.
  value: [1, data.length > 20 ? 20 : data.length],
  title: `Explore ${label}`,
  //description: `${label} horizontal scrolling`,
  display: d => md`${label} from **${ordinal(d[0])}** to **${ordinal(d[1])}**`
})
```

```js
emojis = getBars("emojis")
```

```js
mentions = getBars("mentions")
```

```js
hashtags = getBars("hashtags")
```

### Helpers and other stuff

```js
// https://github.com/mathiasbynens/emoji-regex
emojiRegex = /\u{1F3F4}\u{E0067}\u{E0062}(?:\u{E0077}\u{E006C}\u{E0073}|\u{E0073}\u{E0063}\u{E0074}|\u{E0065}\u{E006E}\u{E0067})\u{E007F}|(?:\u{1F9D1}\u{1F3FF}\u200D\u2764\uFE0F\u200D(?:\u{1F48B}\u200D)?\u{1F9D1}|\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D[\u{1F468}\u{1F469}])[\u{1F3FB}-\u{1F3FE}]|(?:\u{1F9D1}\u{1F3FE}\u200D\u2764\uFE0F\u200D(?:\u{1F48B}\u200D)?\u{1F9D1}|\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D[\u{1F468}\u{1F469}])[\u{1F3FB}-\u{1F3FD}\u{1F3FF}]|(?:\u{1F9D1}\u{1F3FD}\u200D\u2764\uFE0F\u200D(?:\u{1F48B}\u200D)?\u{1F9D1}|\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D[\u{1F468}\u{1F469}])[\u{1F3FB}\u{1F3FC}\u{1F3FE}\u{1F3FF}]|(?:\u{1F9D1}\u{1F3FC}\u200D\u2764\uFE0F\u200D(?:\u{1F48B}\u200D)?\u{1F9D1}|\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D[\u{1F468}\u{1F469}])[\u{1F3FB}\u{1F3FD}-\u{1F3FF}]|(?:\u{1F9D1}\u{1F3FB}\u200D\u2764\uFE0F\u200D(?:\u{1F48B}\u200D)?\u{1F9D1}|\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D[\u{1F468}\u{1F469}])[\u{1F3FC}-\u{1F3FF}]|\u{1F468}(?:\u{1F3FB}(?:\u200D(?:\u2764\uFE0F\u200D(?:\u{1F48B}\u200D\u{1F468}[\u{1F3FB}-\u{1F3FF}]|\u{1F468}[\u{1F3FB}-\u{1F3FF}])|\u{1F91D}\u200D\u{1F468}[\u{1F3FC}-\u{1F3FF}]|[\u2695\u2696\u2708]\uFE0F|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]))?|[\u{1F3FC}-\u{1F3FF}]\u200D\u2764\uFE0F\u200D(?:\u{1F48B}\u200D\u{1F468}[\u{1F3FB}-\u{1F3FF}]|\u{1F468}[\u{1F3FB}-\u{1F3FF}])|\u200D(?:\u2764\uFE0F\u200D(?:\u{1F48B}\u200D)?\u{1F468}|[\u{1F468}\u{1F469}]\u200D(?:\u{1F466}\u200D\u{1F466}|\u{1F467}\u200D[\u{1F466}\u{1F467}])|\u{1F466}\u200D\u{1F466}|\u{1F467}\u200D[\u{1F466}\u{1F467}]|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FF}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}-\u{1F3FE}]|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FE}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}-\u{1F3FD}\u{1F3FF}]|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FD}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}\u{1F3FC}\u{1F3FE}\u{1F3FF}]|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FC}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}\u{1F3FD}-\u{1F3FF}]|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|(?:\u{1F3FF}\u200D[\u2695\u2696\u2708]|\u{1F3FE}\u200D[\u2695\u2696\u2708]|\u{1F3FD}\u200D[\u2695\u2696\u2708]|\u{1F3FC}\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:[\u{1F468}\u{1F469}]\u200D[\u{1F466}\u{1F467}]|[\u{1F466}\u{1F467}])|\u{1F3FF}|\u{1F3FE}|\u{1F3FD}|\u{1F3FC})?|(?:\u{1F469}(?:\u{1F3FB}\u200D\u2764\uFE0F\u200D(?:\u{1F48B}\u200D[\u{1F468}\u{1F469}]|[\u{1F468}\u{1F469}])|[\u{1F3FC}-\u{1F3FF}]\u200D\u2764\uFE0F\u200D(?:\u{1F48B}\u200D[\u{1F468}\u{1F469}]|[\u{1F468}\u{1F469}]))|\u{1F9D1}[\u{1F3FB}-\u{1F3FF}]\u200D\u{1F91D}\u200D\u{1F9D1})[\u{1F3FB}-\u{1F3FF}]|\u{1F469}\u200D\u{1F469}\u200D(?:\u{1F466}\u200D\u{1F466}|\u{1F467}\u200D[\u{1F466}\u{1F467}])|\u{1F469}(?:\u200D(?:\u2764\uFE0F\u200D(?:\u{1F48B}\u200D[\u{1F468}\u{1F469}]|[\u{1F468}\u{1F469}])|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FF}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]|\u{1F3FE}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]|\u{1F3FD}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]|\u{1F3FC}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]|\u{1F3FB}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F9D1}(?:\u200D(?:\u{1F91D}\u200D\u{1F9D1}|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F384}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FF}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F384}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]|\u{1F3FE}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F384}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]|\u{1F3FD}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F384}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]|\u{1F3FC}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F384}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]|\u{1F3FB}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F384}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F469}\u200D\u{1F466}\u200D\u{1F466}|\u{1F469}\u200D\u{1F469}\u200D[\u{1F466}\u{1F467}]|\u{1F469}\u200D\u{1F467}\u200D[\u{1F466}\u{1F467}]|(?:\u{1F441}\uFE0F\u200D\u{1F5E8}|\u{1F9D1}(?:\u{1F3FF}\u200D[\u2695\u2696\u2708]|\u{1F3FE}\u200D[\u2695\u2696\u2708]|\u{1F3FD}\u200D[\u2695\u2696\u2708]|\u{1F3FC}\u200D[\u2695\u2696\u2708]|\u{1F3FB}\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\u{1F469}(?:\u{1F3FF}\u200D[\u2695\u2696\u2708]|\u{1F3FE}\u200D[\u2695\u2696\u2708]|\u{1F3FD}\u200D[\u2695\u2696\u2708]|\u{1F3FC}\u200D[\u2695\u2696\u2708]|\u{1F3FB}\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\u{1F636}\u200D\u{1F32B}|\u{1F3F3}\uFE0F\u200D\u26A7|\u{1F43B}\u200D\u2744|(?:[\u{1F3C3}\u{1F3C4}\u{1F3CA}\u{1F46E}\u{1F470}\u{1F471}\u{1F473}\u{1F477}\u{1F481}\u{1F482}\u{1F486}\u{1F487}\u{1F645}-\u{1F647}\u{1F64B}\u{1F64D}\u{1F64E}\u{1F6A3}\u{1F6B4}-\u{1F6B6}\u{1F926}\u{1F935}\u{1F937}-\u{1F939}\u{1F93D}\u{1F93E}\u{1F9B8}\u{1F9B9}\u{1F9CD}-\u{1F9CF}\u{1F9D4}\u{1F9D6}-\u{1F9DD}][\u{1F3FB}-\u{1F3FF}]|[\u{1F46F}\u{1F93C}\u{1F9DE}\u{1F9DF}])\u200D[\u2640\u2642]|[\u26F9\u{1F3CB}\u{1F3CC}\u{1F575}][\uFE0F\u{1F3FB}-\u{1F3FF}]\u200D[\u2640\u2642]|\u{1F3F4}\u200D\u2620|[\u{1F3C3}\u{1F3C4}\u{1F3CA}\u{1F46E}\u{1F470}\u{1F471}\u{1F473}\u{1F477}\u{1F481}\u{1F482}\u{1F486}\u{1F487}\u{1F645}-\u{1F647}\u{1F64B}\u{1F64D}\u{1F64E}\u{1F6A3}\u{1F6B4}-\u{1F6B6}\u{1F926}\u{1F935}\u{1F937}-\u{1F939}\u{1F93D}\u{1F93E}\u{1F9B8}\u{1F9B9}\u{1F9CD}-\u{1F9CF}\u{1F9D4}\u{1F9D6}-\u{1F9DD}]\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299\u{1F170}\u{1F171}\u{1F17E}\u{1F17F}\u{1F202}\u{1F237}\u{1F321}\u{1F324}-\u{1F32C}\u{1F336}\u{1F37D}\u{1F396}\u{1F397}\u{1F399}-\u{1F39B}\u{1F39E}\u{1F39F}\u{1F3CD}\u{1F3CE}\u{1F3D4}-\u{1F3DF}\u{1F3F5}\u{1F3F7}\u{1F43F}\u{1F4FD}\u{1F549}\u{1F54A}\u{1F56F}\u{1F570}\u{1F573}\u{1F576}-\u{1F579}\u{1F587}\u{1F58A}-\u{1F58D}\u{1F5A5}\u{1F5A8}\u{1F5B1}\u{1F5B2}\u{1F5BC}\u{1F5C2}-\u{1F5C4}\u{1F5D1}-\u{1F5D3}\u{1F5DC}-\u{1F5DE}\u{1F5E1}\u{1F5E3}\u{1F5E8}\u{1F5EF}\u{1F5F3}\u{1F5FA}\u{1F6CB}\u{1F6CD}-\u{1F6CF}\u{1F6E0}-\u{1F6E5}\u{1F6E9}\u{1F6F0}\u{1F6F3}])\uFE0F|\u{1F3F3}\uFE0F\u200D\u{1F308}|\u{1F469}\u200D\u{1F467}|\u{1F469}\u200D\u{1F466}|\u{1F635}\u200D\u{1F4AB}|\u{1F62E}\u200D\u{1F4A8}|\u{1F415}\u200D\u{1F9BA}|\u{1F9D1}(?:\u{1F3FF}|\u{1F3FE}|\u{1F3FD}|\u{1F3FC}|\u{1F3FB})?|\u{1F469}(?:\u{1F3FF}|\u{1F3FE}|\u{1F3FD}|\u{1F3FC}|\u{1F3FB})?|\u{1F1FD}\u{1F1F0}|\u{1F1F6}\u{1F1E6}|\u{1F1F4}\u{1F1F2}|\u{1F408}\u200D\u2B1B|\u2764\uFE0F\u200D[\u{1F525}\u{1FA79}]|\u{1F441}\uFE0F|\u{1F3F3}\uFE0F|\u{1F1FF}[\u{1F1E6}\u{1F1F2}\u{1F1FC}]|\u{1F1FE}[\u{1F1EA}\u{1F1F9}]|\u{1F1FC}[\u{1F1EB}\u{1F1F8}]|\u{1F1FB}[\u{1F1E6}\u{1F1E8}\u{1F1EA}\u{1F1EC}\u{1F1EE}\u{1F1F3}\u{1F1FA}]|\u{1F1FA}[\u{1F1E6}\u{1F1EC}\u{1F1F2}\u{1F1F3}\u{1F1F8}\u{1F1FE}\u{1F1FF}]|\u{1F1F9}[\u{1F1E6}\u{1F1E8}\u{1F1E9}\u{1F1EB}-\u{1F1ED}\u{1F1EF}-\u{1F1F4}\u{1F1F7}\u{1F1F9}\u{1F1FB}\u{1F1FC}\u{1F1FF}]|\u{1F1F8}[\u{1F1E6}-\u{1F1EA}\u{1F1EC}-\u{1F1F4}\u{1F1F7}-\u{1F1F9}\u{1F1FB}\u{1F1FD}-\u{1F1FF}]|\u{1F1F7}[\u{1F1EA}\u{1F1F4}\u{1F1F8}\u{1F1FA}\u{1F1FC}]|\u{1F1F5}[\u{1F1E6}\u{1F1EA}-\u{1F1ED}\u{1F1F0}-\u{1F1F3}\u{1F1F7}-\u{1F1F9}\u{1F1FC}\u{1F1FE}]|\u{1F1F3}[\u{1F1E6}\u{1F1E8}\u{1F1EA}-\u{1F1EC}\u{1F1EE}\u{1F1F1}\u{1F1F4}\u{1F1F5}\u{1F1F7}\u{1F1FA}\u{1F1FF}]|\u{1F1F2}[\u{1F1E6}\u{1F1E8}-\u{1F1ED}\u{1F1F0}-\u{1F1FF}]|\u{1F1F1}[\u{1F1E6}-\u{1F1E8}\u{1F1EE}\u{1F1F0}\u{1F1F7}-\u{1F1FB}\u{1F1FE}]|\u{1F1F0}[\u{1F1EA}\u{1F1EC}-\u{1F1EE}\u{1F1F2}\u{1F1F3}\u{1F1F5}\u{1F1F7}\u{1F1FC}\u{1F1FE}\u{1F1FF}]|\u{1F1EF}[\u{1F1EA}\u{1F1F2}\u{1F1F4}\u{1F1F5}]|\u{1F1EE}[\u{1F1E8}-\u{1F1EA}\u{1F1F1}-\u{1F1F4}\u{1F1F6}-\u{1F1F9}]|\u{1F1ED}[\u{1F1F0}\u{1F1F2}\u{1F1F3}\u{1F1F7}\u{1F1F9}\u{1F1FA}]|\u{1F1EC}[\u{1F1E6}\u{1F1E7}\u{1F1E9}-\u{1F1EE}\u{1F1F1}-\u{1F1F3}\u{1F1F5}-\u{1F1FA}\u{1F1FC}\u{1F1FE}]|\u{1F1EB}[\u{1F1EE}-\u{1F1F0}\u{1F1F2}\u{1F1F4}\u{1F1F7}]|\u{1F1EA}[\u{1F1E6}\u{1F1E8}\u{1F1EA}\u{1F1EC}\u{1F1ED}\u{1F1F7}-\u{1F1FA}]|\u{1F1E9}[\u{1F1EA}\u{1F1EC}\u{1F1EF}\u{1F1F0}\u{1F1F2}\u{1F1F4}\u{1F1FF}]|\u{1F1E8}[\u{1F1E6}\u{1F1E8}\u{1F1E9}\u{1F1EB}-\u{1F1EE}\u{1F1F0}-\u{1F1F5}\u{1F1F7}\u{1F1FA}-\u{1F1FF}]|\u{1F1E7}[\u{1F1E6}\u{1F1E7}\u{1F1E9}-\u{1F1EF}\u{1F1F1}-\u{1F1F4}\u{1F1F6}-\u{1F1F9}\u{1F1FB}\u{1F1FC}\u{1F1FE}\u{1F1FF}]|\u{1F1E6}[\u{1F1E8}-\u{1F1EC}\u{1F1EE}\u{1F1F1}\u{1F1F2}\u{1F1F4}\u{1F1F6}-\u{1F1FA}\u{1F1FC}\u{1F1FD}\u{1F1FF}]|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|[\u{1F3C3}\u{1F3C4}\u{1F3CA}\u{1F46E}\u{1F470}\u{1F471}\u{1F473}\u{1F477}\u{1F481}\u{1F482}\u{1F486}\u{1F487}\u{1F645}-\u{1F647}\u{1F64B}\u{1F64D}\u{1F64E}\u{1F6A3}\u{1F6B4}-\u{1F6B6}\u{1F926}\u{1F935}\u{1F937}-\u{1F939}\u{1F93D}\u{1F93E}\u{1F9B8}\u{1F9B9}\u{1F9CD}-\u{1F9CF}\u{1F9D4}\u{1F9D6}-\u{1F9DD}][\u{1F3FB}-\u{1F3FF}]|[\u26F9\u{1F3CB}\u{1F3CC}\u{1F575}][\uFE0F\u{1F3FB}-\u{1F3FF}]|\u{1F3F4}|[\u270A\u270B\u{1F385}\u{1F3C2}\u{1F3C7}\u{1F442}\u{1F443}\u{1F446}-\u{1F450}\u{1F466}\u{1F467}\u{1F46B}-\u{1F46D}\u{1F472}\u{1F474}-\u{1F476}\u{1F478}\u{1F47C}\u{1F483}\u{1F485}\u{1F48F}\u{1F491}\u{1F4AA}\u{1F57A}\u{1F595}\u{1F596}\u{1F64C}\u{1F64F}\u{1F6C0}\u{1F6CC}\u{1F90C}\u{1F90F}\u{1F918}-\u{1F91C}\u{1F91E}\u{1F91F}\u{1F930}-\u{1F934}\u{1F936}\u{1F977}\u{1F9B5}\u{1F9B6}\u{1F9BB}\u{1F9D2}\u{1F9D3}\u{1F9D5}][\u{1F3FB}-\u{1F3FF}]|[\u261D\u270C\u270D\u{1F574}\u{1F590}][\uFE0F\u{1F3FB}-\u{1F3FF}]|[\u270A\u270B\u{1F385}\u{1F3C2}\u{1F3C7}\u{1F408}\u{1F415}\u{1F43B}\u{1F442}\u{1F443}\u{1F446}-\u{1F450}\u{1F466}\u{1F467}\u{1F46B}-\u{1F46D}\u{1F472}\u{1F474}-\u{1F476}\u{1F478}\u{1F47C}\u{1F483}\u{1F485}\u{1F48F}\u{1F491}\u{1F4AA}\u{1F57A}\u{1F595}\u{1F596}\u{1F62E}\u{1F635}\u{1F636}\u{1F64C}\u{1F64F}\u{1F6C0}\u{1F6CC}\u{1F90C}\u{1F90F}\u{1F918}-\u{1F91C}\u{1F91E}\u{1F91F}\u{1F930}-\u{1F934}\u{1F936}\u{1F977}\u{1F9B5}\u{1F9B6}\u{1F9BB}\u{1F9D2}\u{1F9D3}\u{1F9D5}]|[\u{1F3C3}\u{1F3C4}\u{1F3CA}\u{1F46E}\u{1F470}\u{1F471}\u{1F473}\u{1F477}\u{1F481}\u{1F482}\u{1F486}\u{1F487}\u{1F645}-\u{1F647}\u{1F64B}\u{1F64D}\u{1F64E}\u{1F6A3}\u{1F6B4}-\u{1F6B6}\u{1F926}\u{1F935}\u{1F937}-\u{1F939}\u{1F93D}\u{1F93E}\u{1F9B8}\u{1F9B9}\u{1F9CD}-\u{1F9CF}\u{1F9D4}\u{1F9D6}-\u{1F9DD}]|[\u{1F46F}\u{1F93C}\u{1F9DE}\u{1F9DF}]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55\u{1F004}\u{1F0CF}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F201}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F236}\u{1F238}-\u{1F23A}\u{1F250}\u{1F251}\u{1F300}-\u{1F320}\u{1F32D}-\u{1F335}\u{1F337}-\u{1F37C}\u{1F37E}-\u{1F384}\u{1F386}-\u{1F393}\u{1F3A0}-\u{1F3C1}\u{1F3C5}\u{1F3C6}\u{1F3C8}\u{1F3C9}\u{1F3CF}-\u{1F3D3}\u{1F3E0}-\u{1F3F0}\u{1F3F8}-\u{1F407}\u{1F409}-\u{1F414}\u{1F416}-\u{1F43A}\u{1F43C}-\u{1F43E}\u{1F440}\u{1F444}\u{1F445}\u{1F451}-\u{1F465}\u{1F46A}\u{1F479}-\u{1F47B}\u{1F47D}-\u{1F480}\u{1F484}\u{1F488}-\u{1F48E}\u{1F490}\u{1F492}-\u{1F4A9}\u{1F4AB}-\u{1F4FC}\u{1F4FF}-\u{1F53D}\u{1F54B}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F5A4}\u{1F5FB}-\u{1F62D}\u{1F62F}-\u{1F634}\u{1F637}-\u{1F644}\u{1F648}-\u{1F64A}\u{1F680}-\u{1F6A2}\u{1F6A4}-\u{1F6B3}\u{1F6B7}-\u{1F6BF}\u{1F6C1}-\u{1F6C5}\u{1F6D0}-\u{1F6D2}\u{1F6D5}-\u{1F6D7}\u{1F6EB}\u{1F6EC}\u{1F6F4}-\u{1F6FC}\u{1F7E0}-\u{1F7EB}\u{1F90D}\u{1F90E}\u{1F910}-\u{1F917}\u{1F91D}\u{1F920}-\u{1F925}\u{1F927}-\u{1F92F}\u{1F93A}\u{1F93F}-\u{1F945}\u{1F947}-\u{1F976}\u{1F978}\u{1F97A}-\u{1F9B4}\u{1F9B7}\u{1F9BA}\u{1F9BC}-\u{1F9CB}\u{1F9D0}\u{1F9E0}-\u{1F9FF}\u{1FA70}-\u{1FA74}\u{1FA78}-\u{1FA7A}\u{1FA80}-\u{1FA86}\u{1FA90}-\u{1FAA8}\u{1FAB0}-\u{1FAB6}\u{1FAC0}-\u{1FAC2}\u{1FAD0}-\u{1FAD6}]/gu;
```

```js echo
'🔥 🔥 hello! fffℹ️ test👨‍👩‍👦'.match(emojiRegex) // test
```

```js
classifyTweet = (tweet) => {
  return tweet.text.startsWith("RT @") ? 'RT' : 'T';
}
```

```js
getEntities = (tweet, entityType) => {
  // get #hashtags and @mentions from a tweet
  
  const entityName = (entityType === 'mentions') ? 'username'
    : (entityType === 'hashtags') ? 'tag'
    : null; // we should never get here

  const entities = _.get(tweet, `entities.${entityType}`)
  
  return entities ? entities.map((d) => d[entityName]) : null;

}
```

```js
numberFormatter = Intl.NumberFormat('en-EN', { maximumFractionDigits: 1,notation: "compact" , compactDisplay: "short"});
```

```js
timezoneList = mtz.tz.names()
```

```js
convertTZ = (date) => {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: timezone}));   
}
```

```js echo
ordinal = (n) => `${n}${["st","nd","rd"][((n+90)%100-10)%10-1]||"th"}`
```

## Appendix

```js
import {tweet} from "@mbostock/tweet"
```

```js
mtz = require('https://bundle.run/moment-timezone@0.5.33')
```

```js
require('lodash@4.17.21/lodash.js')
```

```js
import {addTooltips} from "@mkfreeman/plot-tooltip"
```

```js
import {dataInput} from "@john-guerra/data-input"
```

```js
import {toc} from "@nebrius/indented-toc"
```

```js
import {legend} from "@d3/color-legend"
```

```js
import {rangeSlider} from '@mootari/range-slider'
```
