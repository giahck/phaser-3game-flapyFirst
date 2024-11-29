package com.trhegame.GameScore.reciveDataRabit;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    @Bean
    public Queue scoreQueue() {
        return new Queue("scoreQueue", true); // Durable
    }

    @Bean
    public DirectExchange scoreExchange() {
        return new DirectExchange("scoreExchange"); // Direct exchange
    }

    @Bean
    public Binding binding(Queue scoreQueue, DirectExchange scoreExchange) {
        return BindingBuilder.bind(scoreQueue)
                .to(scoreExchange)
                .with("score.update"); // Routing key
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setReplyTimeout(5000); // Set reply timeout to 5 seconds
        return template;
    }

    @Bean
    public SimpleMessageListenerContainer container(ConnectionFactory connectionFactory,
                                                    MessageListenerAdapter listenerAdapter) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames("scoreQueue");
        container.setMessageListener(listenerAdapter);
        // Configura il container per non aspettarsi risposte
        container.setDefaultRequeueRejected(false);
        return container;
    }

    @Bean
    public MessageListenerAdapter listenerAdapter(ScoreReceiver receiver) {
        return new MessageListenerAdapter(receiver, "receiveMessage");
    }
}
