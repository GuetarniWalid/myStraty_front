export default function constructTooltipLineChart(tooltipModel, dataAsset, darkMode) {
    // Tooltip Element
    let tooltipEl = document.getElementById('chartjs-tooltip');

    // Create element on first render
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      document.body.appendChild(tooltipEl);
    } else {
      tooltipEl.innerHTML = '';
    }

    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
      tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
      tooltipEl.classList.add('no-transform');
    }

    // Set title
    const titleToFormatData = new Date(tooltipModel.title).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const title = `<p class='tooltipTitle ${darkMode ? 'tooltipTitleDark' : null}'>${titleToFormatData}</p>`;
    tooltipEl.innerHTML += title;

    // Set body
    const unit = this._chartInstance.chart.options.scales.xAxes[0].time.unit;
    function createBodyElement(classLegend, currency, legendName, sign) {
      const legend = `<span class='tooltipLegend ${classLegend}'></span>`;
      const leftSpan = `<span>${legend} ${legendName}</span>`;

      const priceFormated =
      unit === 'day'
      ? String(dataAsset[currency].valuesByDay[tooltipModel.dataPoints[0].index]).substring(0, 7)
      : unit === 'week' ?
      String(dataAsset[currency].valuesByWeek[tooltipModel.dataPoints[0].index]).substring(0, 7) 
      : String(dataAsset[currency].valuesByMonth[tooltipModel.dataPoints[0].index]).substring(0, 7) 
      
      const element = `<p class='tooltipBody ${darkMode ? 'tooltipBodyDark' : null}'>${leftSpan}<span>${sign}${priceFormated}</span></p>`;
      tooltipEl.innerHTML += element;
    }
    //eur
    createBodyElement('tooltipLegendEur', 'eur', 'euro', '€ ');
    //btc
    createBodyElement('tooltipLegendBtc', 'btc', 'bitcoin', '₿ ');
    //eth
    createBodyElement('tooltipLegendEth', 'eth', 'ethereum', 'Ξ ');

    // `this` will be the overall tooltip
    var position = this._chart.canvas.getBoundingClientRect();

    // Display, position
    tooltipEl.style.opacity = 1;
    tooltipEl.style.background = darkMode ? '#2e2e3d' : '#fff';
    tooltipEl.style.borderRadius = '5px';
    tooltipEl.style.minWidth = '180px';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.transition = 'all 0.2s';

    //setting of tooltip position
    switch (tooltipModel.xAlign) {
      case 'center':
        switch (tooltipModel.yAlign) {
          case 'center':
            tooltipEl.style.transform = 'translate(-55%, -55%)';
            break;
          case 'right':
            tooltipEl.style.transform = 'translate(-55%, -105%)';
            break;
          default:
            tooltipEl.style.transform = 'translate(-55%, 5%)';
        }
        break;
      case 'right':
        switch (tooltipModel.yAlign) {
          case 'center':
            tooltipEl.style.transform = 'translate(-105%, -55%)';
            break;
          case 'right':
            tooltipEl.style.transform = 'translate(-105%, -105%)';
            break;
          default:
            tooltipEl.style.transform = 'translate(-105%, 5%)';
        }
        break;
      default:
        switch (tooltipModel.yAlign) {
          case 'center':
            tooltipEl.style.transform = 'translate(5%, -55%)';
            break;
          case 'right':
            tooltipEl.style.transform = 'translate(5%, -105%)';
            break;
          default:
            tooltipEl.style.transform = 'translate(5%, 5%)';
        }
    }
  }